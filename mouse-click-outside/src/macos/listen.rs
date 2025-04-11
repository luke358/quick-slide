use block::ConcreteBlock;
use cocoa::{appkit::NSEventType, base::id};
use napi::threadsafe_function::{ErrorStrategy, ThreadsafeFunction, ThreadsafeFunctionCallMode};
use objc::{class, msg_send, sel, sel_impl};
use once_cell::sync::Lazy;
use std::sync::{Mutex, Once, atomic::{AtomicUsize, Ordering}};

type MouseCallback = (usize, ThreadsafeFunction<(), ErrorStrategy::Fatal>);

static MOUSE_CLICK_CALLBACKS: Lazy<Mutex<Vec<MouseCallback>>> =
    Lazy::new(|| Mutex::new(Vec::new()));
static NEXT_ID: AtomicUsize = AtomicUsize::new(1);
static INIT: Once = Once::new();

/// 添加监听，返回监听 ID，可用于移除
pub fn add_mouse_click_listener(tsfn: ThreadsafeFunction<(), ErrorStrategy::Fatal>) -> usize {
    let id = NEXT_ID.fetch_add(1, Ordering::SeqCst);

    {
        let mut callbacks = MOUSE_CLICK_CALLBACKS.lock().unwrap();
        callbacks.push((id, tsfn));
    }

    // 只初始化一次全局监听器
    INIT.call_once(|| {
        let mask = NSEventType::NSLeftMouseDown as usize | NSEventType::NSLeftMouseUp as usize;

        let block = ConcreteBlock::new(move |_event: cocoa::base::id| {
            let callbacks = MOUSE_CLICK_CALLBACKS.lock().unwrap();
            for (_, cb) in callbacks.iter() {
                cb.call((), ThreadsafeFunctionCallMode::NonBlocking);
            }
        });
        let block = block.copy();

        unsafe {
            let _monitor: id = msg_send![
                class!(NSEvent),
                addGlobalMonitorForEventsMatchingMask: mask
                handler: block
            ];
        }
    });

    id
}

/// 取消监听
pub fn remove_mouse_click_listener(id: usize) {
    let mut callbacks = MOUSE_CLICK_CALLBACKS.lock().unwrap();
    callbacks.retain(|(cb_id, _)| *cb_id != id);
}
