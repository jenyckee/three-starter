const glslify = require('glslify');
const path = require('path');

var params = {
	projection: 'normal',
	background: false,
	exposure: 1.0,
	bloomStrength: 1.5,
	bloomThreshold: 0.85,
	bloomRadius: 0.4
};

var PARTICLE_SIZE = 20;

export default class App {
	constructor() {
		this.scene = new THREE.Scene();
		this.scene.background = new THREE.Color( 0x6c1176 );

		this.renderer = new THREE.WebGLRenderer( { antialias: false, alpha: true } );
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( window.innerWidth, window.innerHeight );
		document.body.appendChild( this.renderer.domElement );

		// camera
		this.camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 1000 );
		this.camera.position.set( 0, 0, 40 );
		this.scene.add( this.camera );
		// controls
		this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );


		// post processing
		this.renderPass = new THREE.RenderPass( this.scene, this.camera );

		this.copyPass = new THREE.ShaderPass( THREE.CopyShader );
		this.copyPass.renderToScreen = true;

		this.effectFXAA = new THREE.ShaderPass(THREE.FXAAShader);
		this.effectFXAA.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight );

		this.bloomPass = new THREE.UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);//1.0, 9, 0.5, 512);

		this.composer = new THREE.EffectComposer( this.renderer );
		this.composer.addPass( this.renderPass );
		this.composer.addPass( this.effectFXAA );
		this.composer.addPass( this.bloomPass );
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
		var ringGeometry = new THREE.RingGeometry( 6, 10, 50, 8, 0 );

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
		var planetSphere = new THREE.Mesh( pointsGeometry, shaderMaterial );
		planetSphere.rotation.x = Math.PI/2;
		var ring = new THREE.Mesh( ringGeometry, meshMaterial );
		this.group.rotation.x = 3.4/2;
		this.group.rotation.y = 0.3;
		this.group.rotation.z = 0.1;

		this.group.add( planetSphere );
		this.group.add( ring );
		this.group.position.x = 4;

		// STARS

		var geometry1 = new THREE.BoxGeometry( 400, 400, 400, 32, 32, 32 );
		var vertices = geometry1.vertices;
		var positions = new Float32Array( vertices.length * 3 );
		var colors = new Float32Array( vertices.length * 3 );
		var sizes = new Float32Array( vertices.length );
		var vertex;
		var color = new THREE.Color();
		for ( var i = 0, l = vertices.length; i < l; i ++ ) {
			vertex = vertices[ i ];
			vertex.x *= Math.random();
			vertex.y *= Math.random()/20;
			vertex.z *= Math.random();

			vertex.toArray( positions, i * 3 );
			color.setHSL( 1.0, 1.0, 1.0 );
			color.toArray( colors, i * 3 );
			sizes[ i ] = PARTICLE_SIZE * 0.05;
		}

		var geometry = new THREE.BufferGeometry();
		geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
		geometry.addAttribute( 'customColor', new THREE.BufferAttribute( colors, 3 ) );
		geometry.addAttribute( 'size', new THREE.BufferAttribute( sizes, 1 ) );

		var starMaterial = new THREE.ShaderMaterial( {
			uniforms: {
				color:   { value: new THREE.Color( 0xffffff ) },
				texture: { value: new THREE.TextureLoader().load( "/assets/textures/sprites/disc.png" ) }
			},
			vertexShader: glslify(path.resolve(__dirname, '../shaders/star.vert')),
			fragmentShader: glslify(path.resolve(__dirname, '../shaders/star.frag')),
			alphaTest: 0.9
		} );

		var particles = new THREE.Points( geometry, starMaterial );
		this.scene.add( particles );

		//

		window.addEventListener( 'resize', this.onWindowResize.bind(this), false );

		var gui = new dat.GUI();
		gui.add( params, 'exposure', 0.1, 2 );
		gui.add( params, 'bloomThreshold', 0.0, 1.0 ).onChange( function(value) {
				this.bloomPass.threshold = Number(value);
		}.bind(this));
		gui.add( params, 'bloomStrength', 0.0, 3.0 ).onChange( function(value) {
				this.bloomPass.strength = Number(value);
		}.bind(this));
		gui.add( params, 'bloomRadius', 0.0, 1.0 ).onChange( function(value) {
				this.bloomPass.radius = Number(value);
		}.bind(this));
		gui.open();
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
		this.composer.render( 0.05 );
		this.controls.update();

		// this.renderer.render( this.scene, this.camera );
	}
}