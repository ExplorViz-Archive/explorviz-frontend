export default function() {
  this.transition(
    this.toRoute('configuration.usermanagement'),
    this.check(function() {
      return this.get('currentUser').get('user').hasRole('admin');
    }),
    this.redirectTo('configuration.settings')
  );
}
