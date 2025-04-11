#![deny(clippy::all)]

use napi::{
  threadsafe_function::{ErrorStrategy, ThreadsafeFunction},
  Env, JsFunction, JsNumber, Result,
};

#[macro_use]
extern crate napi_derive;

#[cfg(target_os = "macos")]
mod macos;
#[cfg(target_os = "macos")]
pub use crate::macos::{add_mouse_click_listener, remove_mouse_click_listener};

#[cfg(not(any(target_os = "macos")))]
mod fallback;
#[cfg(not(any(target_os = "macos")))]
pub use crate::fallback::{add_mouse_click_listener, remove_mouse_click_listener};

#[napi]
pub fn add_click_outside_listener(env: Env, js_fn: JsFunction) -> Result<JsNumber> {
  let tsfn: ThreadsafeFunction<(), ErrorStrategy::Fatal> =
    js_fn.create_threadsafe_function(0, |ctx| Ok(vec![ctx.env.get_undefined()?]))?;
  let id = add_mouse_click_listener(tsfn);
  env.create_uint32(id as u32)
}

#[napi]
pub fn remove_click_outside_listener(id: Option<JsNumber>) -> Result<()> {
  match id {
    Some(js_num) => {
      let id = js_num.get_uint32()? as usize;
      remove_mouse_click_listener(id);
    }
    None => {}
  }
  Ok(())
}
