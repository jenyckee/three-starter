export default class App {
	constructor() {
		this.scene = new THREE.Scene();
		this.renderer = new THREE.WebGLRenderer( { antialias: true } );
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( window.innerWidth, window.innerHeight );
		document.body.appendChild( this.renderer.domElement );
		// camera
		this.camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 1000 );
		this.camera.position.set( 0, 0, 40 );
		this.scene.add( this.camera );
		// controls
		var controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );

		this.scene.add( new THREE.AmbientLight( 0x222222 ) );
		// light
		var light = new THREE.PointLight( 0xffffff, 1 );
		this.camera.add( light );
		// helper
		this.scene.add( new THREE.AxisHelper( 20 ) );
		// textures
		this.group = new THREE.Group();
		this.scene.add( this.group );
		// points
		var pointsGeometry = new THREE.DodecahedronGeometry( 10 );

		// convex hull
		var meshMaterial = new THREE.MeshLambertMaterial({
			color: 0xffffff,
			opacity: 0.5,
			transparent: true
		});

		var meshGeometry = new THREE.ConvexBufferGeometry( pointsGeometry.vertices );
		var mesh = new THREE.Mesh( meshGeometry, meshMaterial );
		this.group.add( mesh );
		var mesh = new THREE.Mesh( meshGeometry, meshMaterial.clone() );
		this.group.add( mesh );
		window.addEventListener( 'resize', this.onWindowResize, false );
	}
	onWindowResize () {
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize( window.innerWidth, window.innerHeight );
	}
	animate() {
		requestAnimationFrame( this.animate.bind(this) );
		this.group.rotation.y += 0.005;
		this.render();
	}
	render() {
		this.renderer.render( this.scene, this.camera );
	}
}