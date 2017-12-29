const glslify = require('glslify');
const path = require('path');

export default class App {
	constructor() {
		this.scene = new THREE.Scene();
		this.renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( window.innerWidth, window.innerHeight );
		document.body.appendChild( this.renderer.domElement );

		// camera
		this.camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 1000 );
		this.camera.position.set( 0, 0, 40 );
		this.scene.add( this.camera );
		// controls
		var controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );


		// post processing
		this.renderPass = new THREE.RenderPass( this.scene, this.camera );

		this.copyPass = new THREE.ShaderPass( THREE.CopyShader );
		this.copyPass.renderToScreen = true;

		this.composer = new THREE.EffectComposer( this.renderer );
		this.composer.addPass( this.renderPass );
		this.composer.addPass( this.copyPass );

		// light
		var ambientLight = new THREE.AmbientLight( 0xffffff ) 
		this.scene.add( ambientLight );
		var spotLight = new THREE.SpotLight( 0xffffff );
		spotLight.position.z = -20;
		spotLight.position.y = 15;
		spotLight.position.x = 20;
		spotLight.castShadow = true;

		this.camera.add( spotLight );
		// helper
		this.group = new THREE.Group();
		this.scene.add( this.group );
		// points
		var pointsGeometry = new THREE.SphereGeometry( 5, 50, 50 );
		var ringGeometry = new THREE.RingGeometry( 8, 10, 50, 8, 0 );
		var ringGeometry2 = new THREE.RingGeometry( 7, 8, 50, 8, 0 );

    var uniforms = {
			color1 : { type : "c", value : new THREE.Color(0xffa3e5)},
			color2 : { type : "c", value : new THREE.Color(0xab416e)},
			color3 : { type : "c", value : new THREE.Color(0xfe8cde)},
			color4 : { type : "c", value : new THREE.Color(0xf66cb1)},
			color5 : { type : "c", value : new THREE.Color(0xad3d5e)},
			alpha: { type: "f", value: 1.0, min: 0.0, max: 1.0},
			lines: { type:"f", value: 8, min: 1, max: 100},
			linewidth: { type: "f", value: 50.0, min: 0.0, max: 100.0},
		}


		var shaderMaterial = new THREE.ShaderMaterial( {
			uniforms: uniforms,
			vertexShader: glslify(path.resolve(__dirname, '../shaders/planet.vert')),
			fragmentShader: glslify(path.resolve(__dirname, '../shaders/planet.frag'))
		});

		var toonMaterial = new THREE.MeshToonMaterial({
			color: 0xab416e,
			side: THREE.DoubleSide
		})
		var meshMaterial = new THREE.MeshPhongMaterial({
			color: 0xab416e,
			side: THREE.DoubleSide
		});
		var meshMaterial2 = new THREE.MeshPhongMaterial({
			color: 0x8f69ec,
			side: THREE.DoubleSide
		});
		var planetSphere = new THREE.Mesh( pointsGeometry, shaderMaterial );
		planetSphere.rotation.x = 3.14/2;
		var ring = new THREE.Mesh( ringGeometry, meshMaterial );
		var ring2 = new THREE.Mesh( ringGeometry2, meshMaterial2 );
		this.group.rotation.x = 3.4/2;
		this.group.rotation.y = 0.3;
		this.group.rotation.z = 0.1;

		this.group.add( planetSphere );
		this.group.add( ring );
		this.group.add( ring2 );
		this.group.position.x = 4;

		window.addEventListener( 'resize', this.onWindowResize.bind(this), false );
	}
	onWindowResize () {
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize( window.innerWidth, window.innerHeight );
	}
	animate() {
		requestAnimationFrame( this.animate.bind(this) );
		this.group.rotation.z += 0.005;

		this.render();
	}
	render() {
		// this.composer.render( 0.05 );

		this.renderer.render( this.scene, this.camera );
	}
}