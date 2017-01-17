import Ember from 'ember';

export default Ember.Component.extend({

  classNames: ['viz'],

  scene : null,
  webglrenderer: null,
  camera: null,

  animationFrameId: null,


  initRendering() {

    const self = this;

    const height = this.$()[0].clientHeight;
    const width = this.$()[0].clientWidth;
    const canvas = this.$('#threeCanvas')[0];

    this.set('scene', new THREE.Scene());
    this.set('scene.background', new THREE.Color(0xffffff));

    this.set('camera', new THREE.PerspectiveCamera(70, width / height, 0.1, 200));
    this.get('camera').position.set(13, -2, 10);

    this.set('webglrenderer', new THREE.WebGLRenderer({
      antialias: true,  
      canvas: canvas
    }));
    this.get('webglrenderer').setSize(width, height);

    this.createLandscape(this.get('landscape'));

    // Rendering loop //

    function render() {
      const animationId = requestAnimationFrame(render);
      self.set('animationFrameId', animationId);
      self.get('webglrenderer').render(self.get('scene'), self.get('camera'));
    }

    render();

    ////////////////////

  }

});
