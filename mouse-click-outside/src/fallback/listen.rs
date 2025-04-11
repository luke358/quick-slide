use napi::threadsafe_function::{ErrorStrategy, ThreadsafeFunction};

pub fn add_mouse_click_listener(_tsfn: ThreadsafeFunction<(), ErrorStrategy::Fatal>) -> usize {
  0
}

pub fn remove_mouse_click_listener(_id: usize) {}
