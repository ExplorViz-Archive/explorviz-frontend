export default function() {
  this.transition(
    this.toRoute('configuration.usermanagement'),
    this.check(function() {
      return this.get('currentUser').hasRole('admin');
    }),
    this.redirectTo('configuration.settings')
  );
}
