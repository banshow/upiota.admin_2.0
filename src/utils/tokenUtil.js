import {ns} from '../config';
let token;
export function set(data) {
  token = data;
 localStorage.setItem(ns+'.token',token);
}
export function get() {
  return token||localStorage.getItem(ns+'.token');
}
export function remove() {
  token = null;
  localStorage.removeItem(ns+'.token');
}
