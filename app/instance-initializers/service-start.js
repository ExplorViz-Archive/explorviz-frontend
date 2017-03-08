export function initialize(App) {
  App.lookup("service:landscape-reload");
  App.lookup("service:timeshift-reload");
}

export default {
  name: 'service-start',
  initialize
};
