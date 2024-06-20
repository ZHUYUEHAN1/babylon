

var canvas = document.getElementById("renderCanvas");
var createScene = function () {
    var scene = new BABYLON.Scene(engine);
    var camera = new BABYLON.ArcRotateCamera("camera", -Math.PI, -Math.PI, 10, BABYLON.Vector3.Zero(), scene);
	camera.setPosition(new BABYLON.Vector3(1, 1, 20)); // 将相机位置设置为 (0, 10, 40)
    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);
	camera.wheelDeltaPercentage = 0.1; // 每次滚动滚轮时视距改变的比例
	camera.upperBetaLimit = Math.PI/2.1;
    //var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene);
	const  light = new BABYLON.DirectionalLight("dir01", new BABYLON.Vector3(0, -1, 1), scene);
    light.position = new BABYLON.Vector3(0, 15, -30);
	light.intensity = 0;
    //var ground = BABYLON.Mesh.CreateGround("ground1", 6, 6, 2, scene);
	const shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
	shadowGenerator.useBlurExponentialShadowMap = true;
    shadowGenerator.blurKernel = 32;
	var url;
	var fileName;


	//collision
	const wireMat = new BABYLON.StandardMaterial("wireMat");
	wireMat.alpha = 0;
	//wireMat.wireframe = true;

    const hitBox = BABYLON.MeshBuilder.CreateBox("carbox", {width: 1.5, height: 0.6, depth: 1.5});
    hitBox.material = wireMat;
    hitBox.position.x = 0.3;
    hitBox.position.y = 0.3;
    hitBox.position.z = -0.3;

    let carReady = false;
	let animationPaused = false; 
	let pausedFrame = 0; // 变量来记录暂停时的当前帧
//-- yeti.gltf
	url = "https://assets.babylonjs.com/meshes/Yeti/MayaExport/glTF/";
	fileName = "Yeti.gltf";

	//options parameter to set different images on each side
	const buildBox = () => {
		const boxMat = new BABYLON.StandardMaterial("boxMat");
		boxMat.diffuseTexture = new BABYLON.Texture("https://assets.babylonjs.com/environments/cubehouse.png");
		const faceUV = [];
		faceUV[0] = new BABYLON.Vector4(0.5, 0.0, 0.75, 1.0); //rear face
		faceUV[1] = new BABYLON.Vector4(0.0, 0.0, 0.25, 1.0); //front face
		faceUV[2] = new BABYLON.Vector4(0.25, 0, 0.5, 1.0); //right side
		faceUV[3] = new BABYLON.Vector4(0.75, 0, 1.0, 1.0); //left side
		const box = BABYLON.MeshBuilder.CreateBox("box", {faceUV: faceUV, wrap: true});
		box.material = boxMat;
		box.position.copyFromFloats(0, 0.5, 3);
		

		return box;
	}



	const buildRoof = () => {
		const roofMat = new BABYLON.StandardMaterial("roofMat");
	roofMat.diffuseTexture = new BABYLON.Texture("https://assets.babylonjs.com/environments/roof.jpg", scene);	
	const roof = BABYLON.MeshBuilder.CreateCylinder("roof", {diameter: 1.3, height: 1.2, tessellation: 3});
    roof.material = roofMat; 	
	roof.scaling.x = 0.75;
    roof.rotation.z = Math.PI / 2;
    roof.position.y = 1.22;
	roof.position.copyFromFloats(0, 1.22, 3);
	

	

		return roof;
	}
	
	//const box = buildBox();
   // const roof = buildRoof();
	//



	const createHouse = (x, z) => {
        const box = buildBox();
        const roof = buildRoof();
		box.position.copyFromFloats(0, 0.5, 0);
		roof.position.copyFromFloats(0, 1.22, 0);
		const house = BABYLON.Mesh.MergeMeshes([box, roof], true, false, null, false, true);
		house.position.copyFromFloats(x, 0, z);
		shadowGenerator.addShadowCaster(box, true);
		shadowGenerator.addShadowCaster(roof, true);
		
		// 计算朝向原点的旋转角度
		const direction = new BABYLON.Vector3(-x, 0, -z);
		const angle = Math.atan2(direction.x, direction.z);
		house.rotation.y = angle;
	shadowGenerator.addShadowCaster(house, true);
		return house;
    };

    // 円house
    const houses = [];
    houses.push(createHouse(-3, -3));
    //houses.push(createHouse(3, 0));
    houses.push(createHouse(0, -4));
	houses.push(createHouse(3, -3));
	houses.push(createHouse(-1.6, -3.8));
	houses.push(createHouse(1.6, -3.8));
	houses.push(createHouse(-3.8, -1.6));
	houses.push(createHouse(3.8, -1.6));


//長い街
	const createStraightHouse = (numHouses, spacing) => {
		const houses = [];
		for (let i = 1; i < numHouses; i++) {
			const z = i * spacing;
			const offset = (i % 2 === 0) ? -1 : 1; // Alternating sides
			const x = offset * spacing; // Houses on either side of the road
	
			houses.push(createHouse(x, z));
			houses.push(createHouse(-x, z));
		}
		return houses;
	};
	

	const numHouses = 10; // 房子的数量
	const spacing = 2; // 房子之间的间距
	createStraightHouse(numHouses, spacing);
// 地面,创建一个长方形的地面，宽度为10（从-5到5），长度为1
	/*const createGround = () => {
		
		const ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 10, height: 20}, scene);
	
		// 设置地面的位置
		ground.position.x = 0;  // 中心位置
		ground.position.y = 0;  // 地面在y轴上的高度
		ground.position.z = 10; // 在z轴上的位置
	
		// 创建一个绿色材质
		const groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
		groundMaterial.diffuseColor = new BABYLON.Color3(0, 1, 0); // 绿色
	
		// 将材质应用到地面
		ground.material = groundMaterial;
	
		return ground;
	};*/
	// 调用函数创建地面
	//createGround();
	
	
	//地面創造
	    //Create Village ground
		const groundMat = new BABYLON.StandardMaterial("groundMat");
		groundMat.diffuseTexture = new BABYLON.Texture("/assets/dude/scenes/villagegreen.png");
		groundMat.diffuseTexture.hasAlpha = true;
		groundMat.receiveShadows = true;
		const ground = BABYLON.MeshBuilder.CreateGround("ground", {width:24, height:24});
		ground.material = groundMat;
		ground.position.y = 0.1;
		ground.receiveShadows = true;

	const largeGroundMat = new BABYLON.StandardMaterial("largeGroundMat");
    largeGroundMat.diffuseTexture = new BABYLON.Texture("/assets/dude/scenes/valleygrass.png");
	largeGroundMat.receiveShadows = true;

    const largeGround = BABYLON.MeshBuilder.CreateGroundFromHeightMap("largeGround", "/assets/dude/scenes/villageheightmap.png", {width:30, height:70, subdivisions: 20, minHeight:0.05, maxHeight: 3});
    largeGround.material = largeGroundMat;
	largeGround.position.z = 4;
	largeGround.receiveShadows = true;
 // 朝と夜
 const adt = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

 const panel = new BABYLON.GUI.StackPanel();
 panel.width = "220px";
 panel.top = "-25px";
 panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
 panel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
 adt.addControl(panel);

 const header = new BABYLON.GUI.TextBlock();
 header.text = "Night to Day";
 header.height = "30px";
 header.color = "white";
 panel.addControl(header); 

 const slider = new BABYLON.GUI.Slider();
 slider.minimum = 0;
 slider.maximum = 1;
 slider.borderColor = "black";
 slider.color = "gray";
 slider.background = "white";
 slider.value = 0;
 slider.height = "20px";
 slider.width = "200px";
 slider.onValueChangedObservable.add((value) => {
	 if (light) {
		 light.intensity = value;
	 }
 });
 panel.addControl(slider);

    //Skybox
    const skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:150}, scene);
	  const skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
	  skyboxMaterial.backFaceCulling = false;
	  skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("/assets/dude/textures/skybox", scene);
	  skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
	  skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
	  skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
	  skybox.material = skyboxMaterial;

    //tree
	const spriteManagerTrees = new BABYLON.SpriteManager("treesManager", "/assets/dude/textures/palmtree.png", 2000, {width: 512, height: 1024}, scene);

    //We create trees at random positions
    for (let i = 0; i < 200; i++) {
        const tree = new BABYLON.Sprite("tree", spriteManagerTrees);
        tree.position.x = Math.random() * (-4)-3;
        tree.position.z = Math.random() * 20;
        tree.position.y = 0.5;
    }

    for (let i = 0; i < 200; i++) {
        const tree = new BABYLON.Sprite("tree", spriteManagerTrees);
        tree.position.x = Math.random() * (3)+3;
        tree.position.z = Math.random() * 20;
        tree.position.y = 0.5;
    }

    for (let i = 0; i < 300; i++) {
        const tree = new BABYLON.Sprite("tree", spriteManagerTrees);
        tree.position.x = Math.random() * (12)-6;
        tree.position.z = Math.random() * (-10)-5;
        tree.position.y = 0.5;
    }


//噴水
const fountainProfile = [
	new BABYLON.Vector3(0, 0, 0),
	new BABYLON.Vector3(10, 0, 0),
	new BABYLON.Vector3(10, 4, 0),
	new BABYLON.Vector3(8, 4, 0),
	new BABYLON.Vector3(8, 1, 0),
	new BABYLON.Vector3(1, 2, 0),
	new BABYLON.Vector3(1, 15, 0),
	new BABYLON.Vector3(3, 17, 0)
];

const fountain = BABYLON.MeshBuilder.CreateLathe("fountain", {shape: fountainProfile, sideOrientation: BABYLON.Mesh.DOUBLESIDE}, scene);
fountain.position.x = 0;
fountain.position.z = -8;
fountain.scaling.copyFromFloats(0.1, 0.1, 0.1); 


//水 Create a particle system
   var particleSystem = new BABYLON.ParticleSystem("particles", 5000, scene);

   //Texture of each particle
   particleSystem.particleTexture = new BABYLON.Texture("/assets/dude/textures/flare.png", scene);

   // Where the particles come from
   particleSystem.emitter = new BABYLON.Vector3(-0.5, 1, -8); // the starting object, the emitter
   particleSystem.minEmitBox = new BABYLON.Vector3(-0.01, 0, 0); // Starting all from
   particleSystem.maxEmitBox = new BABYLON.Vector3(1, 0, 0); // To...

   // Colors of all particles
   particleSystem.color1 = new BABYLON.Color4(0.8, 0, 0, 1.0);
   particleSystem.color2 = new BABYLON.Color4(0.2, 0, 0, 1.0);
   particleSystem.colorDead = new BABYLON.Color4(0.2, 0, 0.2, 0.0);

   // Size of each particle (random between...
   particleSystem.minSize = 0.1;
   particleSystem.maxSize = 0.5;

   // Life time of each particle (random between...
   particleSystem.minLifeTime = 2;
   particleSystem.maxLifeTime = 3.5;

   // Emission rate
   particleSystem.emitRate = 1500;

   // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
   particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

   // Set the gravity of all particles
   particleSystem.gravity = new BABYLON.Vector3(0, -9.81, 0);

   // Direction of each particle after it has been emitted
   particleSystem.direction1 = new BABYLON.Vector3(-2, 8, 2);
   particleSystem.direction2 = new BABYLON.Vector3(2, 8, -2);

   // Angular speed, in radians
   particleSystem.minAngularSpeed = 0;
   particleSystem.maxAngularSpeed = Math.PI;

   // Speed
   particleSystem.minEmitPower = 1;
   particleSystem.maxEmitPower = 3;
   particleSystem.updateSpeed = 0.025;

   // Start the particle system
   particleSystem.start();

//水制御
let switched = false;  //on off flag

scene.onPointerObservable.add((pointerInfo) => {      		
    switch (pointerInfo.type) {
		case BABYLON.PointerEventTypes.POINTERDOWN:
			if(pointerInfo.pickInfo.hit) {
                pointerDown(pointerInfo.pickInfo.pickedMesh)
            }
		break;
    }
});
const pointerDown = (mesh) => {
    if (mesh === fountain) { //check that the picked mesh is the fountain
        switched = !switched;  //toggle switch
        if(switched) {
            particleSystem.start();
        }
        else {
            particleSystem.stop();
        }
    }
}

//ライト

const buildlampLight = () => {
const lampLight = new BABYLON.SpotLight("lampLight", new BABYLON.Vector3(0, 10, 0), new BABYLON.Vector3(0, -1, 0), Math.PI, 1, scene);
lampLight.diffuse = BABYLON.Color3.Yellow();
//shape to extrude
const lampShape = [];
for(let i = 0; i < 20; i++) {
	lampShape.push(new BABYLON.Vector3(Math.cos(i * Math.PI / 10), Math.sin(i * Math.PI / 10), 0));
}
lampShape.push(lampShape[0]); //close shape

//extrusion path
const lampPath = [];
lampPath.push(new BABYLON.Vector3(0, 0, 0));
lampPath.push(new BABYLON.Vector3(0, 10, 0));
for(let i = 0; i < 20; i++) {
	lampPath.push(new BABYLON.Vector3(1 + Math.cos(Math.PI - i * Math.PI / 40), 10 + Math.sin(Math.PI - i * Math.PI / 40), 0));
}
lampPath.push(new BABYLON.Vector3(3, 11, 0));

const yellowMat = new BABYLON.StandardMaterial("yellowMat");
yellowMat.emissiveColor = BABYLON.Color3.Yellow();

//extrude lamp
const lamp = BABYLON.MeshBuilder.ExtrudeShape("lamp", {cap: BABYLON.Mesh.CAP_END, shape: lampShape, path: lampPath, scale: 0.5});

//add bulb
const bulb = BABYLON.MeshBuilder.CreateSphere("bulb", {diameterX: 1.5, diameterZ: 0.8});

bulb.material = yellowMat;
bulb.position.x = 2;
bulb.position.y = 10.5;

const lampParent = new BABYLON.TransformNode("lampParent", scene);
        lamp.parent = lampParent; // Attach the lamp to the parent
        bulb.parent = lampParent; // Attach the bulb to the parent
        lampLight.parent = lampParent; // Attach the light to the parent


		shadowGenerator.addShadowCaster(lamp, true);
        //shadowGenerator.addShadowCaster(bulb, true);
return lampParent;
}

const lampLightz = buildlampLight();
lampLightz.rotation.y = -Math.PI / 2;
lampLightz.position = new BABYLON.Vector3(0, 0, 5);
lampLightz.scaling = new BABYLON.Vector3(0.1,0.1,0.1);
lamp1 = lampLightz.clone("lamp1");
lamp1.position.z = -1.5;
lamp1.position.x = 1;
lamp2 = lampLightz.clone("lamp2");
lamp2.position.z = 10;
lamp2 = lampLightz.clone("lamp3");
lamp2.position.z = 19;







	BABYLON.SceneLoader.ImportMeshAsync("", "https://assets.babylonjs.com/meshes/", "both_houses_scene.babylon").then((result) => {
        const house1 = scene.getMeshByName("detached_house");
        house1.position.copyFromFloats(3, 0, 0);
        const house2 = result.meshes[2];
        house2.position.copyFromFloats(-3, 0, 0);

    });
   // var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 10, height: 10}, scene);
   // ground.position.y = 0.1; // 抬高地板 1 个单位
	
	//var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 2, segments: 22}, scene);
	//sphere.position.copyFromFloats(0, 3, 0);

	// Load the sound and play it automatically once ready
    const music = new BABYLON.Sound("cello", "https://assets.mixkit.co/music/preview/mixkit-living-the-dream-37.mp3", scene, null, { loop: true, autoplay: true });

  // 创建 GUI 并添加播放和暂停按钮
  var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

  var playButton = BABYLON.GUI.Button.CreateSimpleButton("playButton", "演奏");
  playButton.width = "150px";
  playButton.height = "40px";
  playButton.color = "white";
  playButton.background = "green";
  playButton.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
  playButton.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
  playButton.top = "10px";
  playButton.left = "10px";
  playButton.onPointerUpObservable.add(function() {
	  if (music.isReady() && !music.isPlaying) {
		  music.play();
	  }
  });
  advancedTexture.addControl(playButton);

  var pauseButton = BABYLON.GUI.Button.CreateSimpleButton("pauseButton", "一時停止");
  pauseButton.width = "150px";
  pauseButton.height = "40px";
  pauseButton.color = "white";
  pauseButton.background = "red";
  pauseButton.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
  pauseButton.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
  pauseButton.top = "60px";
  pauseButton.left = "10px";
  pauseButton.onPointerUpObservable.add(function() {
	  if (music.isPlaying) {
		  music.pause();
	  }
  });
  advancedTexture.addControl(pauseButton);   

//yeti
	BABYLON.SceneLoader.ImportMesh("", url, fileName, scene, function (newMeshes) {
		var mesh = newMeshes[0];
			mesh.position.copyFromFloats(0, 0.1, 0);
			mesh.scaling.copyFromFloats(0.1,0.1,0.1);
			shadowGenerator.addShadowCaster(mesh, true);
	});


	BABYLON.SceneLoader.ImportMeshAsync("him", "/assets/dude/scenes/", "Dude.babylon", scene).then((result) => {
        var dude = result.meshes[0];
        dude.scaling = new BABYLON.Vector3(0.01, 0.01, 0.01);
        dude.position = new BABYLON.Vector3(1, 0.1, -1);        
		shadowGenerator.addShadowCaster(dude, true);
        scene.beginAnimation(result.skeletons[0], 0, 100, true, 1.0);
		 // 创建位置动画
		 const animDude = new BABYLON.Animation("dudeAnimation", "position.x", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
		 const keys = [];
		 keys.push({ frame: 0, value: -1 });
		 keys.push({ frame: 50, value: 1 });
		 keys.push({ frame: 51, value: 1 });
		 keys.push({ frame: 100, value: -1 });
		 keys.push({ frame: 101, value: -1 });
		 keys.push({ frame: 150, value: 1 });
		 keys.push({ frame: 151, value: 1 });
		 keys.push({ frame: 199, value: -1 });
		 keys.push({ frame: 200, value: -1 });
		 animDude.setKeys(keys);
		 dude.animations.push(animDude);
		//feixianxing
		// const cubicEase = new BABYLON.CubicEase();
		// cubicEase.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
		// animDude.setEasingFunction(cubicEase);
		
		 // 创建旋转动画
		 const animDudeRotation = new BABYLON.Animation("dudeRotationAnimation", "rotation.y", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
		 const rotationKeys = [];
		 rotationKeys.push({ frame: 0, value: -Math.PI/2 });
		 rotationKeys.push({ frame: 50, value: -Math.PI/2 });
		 rotationKeys.push({ frame: 51, value: Math.PI/2 }); 
		 rotationKeys.push({ frame: 100, value: Math.PI/2 });
		 rotationKeys.push({ frame: 101, value: -Math.PI/2 });
		 rotationKeys.push({ frame: 150, value: -Math.PI/2 });
		 rotationKeys.push({ frame: 151, value: Math.PI/2 });
		 rotationKeys.push({ frame: 199, value: Math.PI/2 });
		 rotationKeys.push({ frame: 200, value: -Math.PI/2 });
		 animDudeRotation.setKeys(rotationKeys);
		// animDudeRotation.setEasingFunction(cubicEase);
		 dude.animations.push(animDudeRotation);
		
		 // 开始位置动画
		 //var animation1 = scene.beginAnimation(dude, 0, 200, true, 1.0);
		 //console.log(animation1)
		 animatable = scene.beginDirectAnimation(dude, [animDude, animDudeRotation], 0, 200, true, 1.0);

		 scene.onBeforeRenderObservable.add(() => {
			if (carReady) {
				if (!result.meshes[0].intersectsMesh(hitBox) && scene.getMeshByName("car").intersectsMesh(hitBox)) {
					if (!animationPaused) {
					//console.log("Collision detected, stopping animation.");
					animatable.pause();
					pausedFrame = dude.animations[0].runtimeAnimations[0].currentFrame; // 记录暂停时的当前帧
					//scene.stopAnimation(dude);
					animationPaused = true;
					//console.log(pausedFrame);
	
				}
				}
				else {
					if (animationPaused) {
					//console.log("No Collision");
					animatable.restart();
					//scene.beginAnimation(dude, pausedFrame, 200, true, 1.0);
					//animation1.goToFrame(pausedFrame);
					animationPaused = false;
					//console.log(pausedFrame);
				}
	
	
				}
			}
			else {
				//console.log("Car is not ready, skipping collision check.");
				//scene.beginAnimation(dude, dude.animations[0].currentFrame, 200, true, 1.0);
				animationPaused = false;
			}
		});
			
       
		
	

    });


	const buildCar = () => {
		
		//base
		const outline = [
			new BABYLON.Vector3(-0.3, 0, -0.1),
			new BABYLON.Vector3(0.2, 0, -0.1),
		]
	
		//curved front
		for (let i = 0; i < 20; i++) {
			outline.push(new BABYLON.Vector3(0.2 * Math.cos(i * Math.PI / 40), 0, 0.2 * Math.sin(i * Math.PI / 40) - 0.1));
		}
	
		//top
		outline.push(new BABYLON.Vector3(0, 0, 0.1));
		outline.push(new BABYLON.Vector3(-0.3, 0, 0.1));
	
		//back formed automatically
	
		//car face UVs
		const faceUV = [];
		faceUV[0] = new BABYLON.Vector4(0, 0.5, 0.38, 1);
		faceUV[1] = new BABYLON.Vector4(0, 0, 1, 0.5);
		faceUV[2] = new BABYLON.Vector4(0.38, 1, 0, 0.5);

		//car material
		const carMat = new BABYLON.StandardMaterial("carMat");
		carMat.diffuseTexture = new BABYLON.Texture("https://assets.babylonjs.com/environments/car.png");

		const car = BABYLON.MeshBuilder.ExtrudePolygon("car", {shape: outline, depth: 0.2, faceUV: faceUV, wrap: true});
		car.material = carMat;

		//wheel face UVs
		const wheelUV = [];
		wheelUV[0] = new BABYLON.Vector4(0, 0, 1, 1);
		wheelUV[1] = new BABYLON.Vector4(0, 0.5, 0, 0.5);
		wheelUV[2] = new BABYLON.Vector4(0, 0, 1, 1);
		
		//wheel material
		const wheelMat = new BABYLON.StandardMaterial("wheelMat");
		wheelMat.diffuseTexture = new BABYLON.Texture("https://assets.babylonjs.com/environments/wheel.png");

		const wheelRB = BABYLON.MeshBuilder.CreateCylinder("wheelRB", {diameter: 0.125, height: 0.05, faceUV: wheelUV})
		wheelRB.material = wheelMat;
		wheelRB.parent = car;
		wheelRB.position.z = -0.1;
		wheelRB.position.x = -0.2;
		wheelRB.position.y = 0.035;

		wheelRF = wheelRB.clone("wheelRF");
		wheelRF.position.x = 0.1;

		wheelLB = wheelRB.clone("wheelLB");
		wheelLB.position.y = -0.2 - 0.035;

		wheelLF = wheelRF.clone("wheelLF");
		wheelLF.position.y = -0.2 - 0.035;
		

	//wheel
	const animWheel = new BABYLON.Animation("wheelAnimation", "rotation.y", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
	const wheelKeys = []; 

	//At the animation key 0, the value of rotation.y is 0
	wheelKeys.push({
		frame: 0,
		value: 0
	});
	
	//At the animation key 30, (after 1 sec since animation fps = 30) the value of rotation.y is 2PI for a complete rotation
	wheelKeys.push({
		frame: 30,
		value: 2 * Math.PI
	});
		//set the keys
		animWheel.setKeys(wheelKeys);

		//Link this animation to the right back wheel
		wheelRB.animations = [];
		wheelRB.animations.push(animWheel);
		wheelRF.animations = [];
		wheelRF.animations.push(animWheel);
		wheelLB.animations = [];
		wheelLB.animations.push(animWheel);
		wheelLF.animations = [];
		wheelLF.animations.push(animWheel);
		//Begin animation - object to animate, first frame, last frame and loop if true
		scene.beginAnimation(wheelRB, 0, 30, true);
		scene.beginAnimation(wheelRF, 0, 30, true);
		scene.beginAnimation(wheelLB, 0, 30, true);
		scene.beginAnimation(wheelLF, 0, 30, true);


		// 创建车的动画
		const animCar = new BABYLON.Animation("carAnimation", "position", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

		// 创建动画关键帧数组
		const carKeys = []; 


		// 创建運転动画
		carKeys.push({frame: 0, value: new BABYLON.Vector3(-2, 0.3, -1.2)});
		carKeys.push({frame: 50, value: new BABYLON.Vector3(0.5, 0.3, -3)});
		carKeys.push({frame: 100, value: new BABYLON.Vector3(-1, 0.3, 9)});
		carKeys.push({frame: 105, value: new BABYLON.Vector3(-1, 0.8, 10)});
		carKeys.push({frame: 110, value: new BABYLON.Vector3(-0.5, 0.3, 11)});
		carKeys.push({frame: 150, value: new BABYLON.Vector3(1, 0.3, 21)});
		carKeys.push({frame: 180, value: new BABYLON.Vector3(-9, 5.3, 43)});


        // 创建旋转动画
        const animCarRotation = new BABYLON.Animation("carRotationAnimation", "rotation.y", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
        const carRotationKeys = [];
        carRotationKeys.push({ frame: 0, value: 0 });
        carRotationKeys.push({ frame: 20, value: Math.PI / 3 });
		carRotationKeys.push({ frame: 40, value: Math.PI / 3 });
        carRotationKeys.push({ frame: 50, value: -Math.PI / 2 }); 
		carRotationKeys.push({ frame: 100, value: -Math.PI / 3 });
        carRotationKeys.push({ frame: 150, value: -Math.PI / 1 });
		carRotationKeys.push({ frame: 180, value: -Math.PI / 4 });
        

		// 设置动画关键帧
		animCar.setKeys(carKeys);
		animCarRotation.setKeys(carRotationKeys);
		// 将动画添加到车的动画列表中
		car.animations = [];
		car.animations.push(animCar);
		car.animations.push(animCarRotation);

		// 开始动画
		scene.beginAnimation(car, 0, 210, true);




		return car;
	}

	const car = buildCar();
    car.rotation.x = -Math.PI / 2;
	car.position.copyFromFloats(1, 0.3, -1.2);
	car.scaling.copyFromFloats(2,2,2);
	shadowGenerator.addShadowCaster(car, true);

	carReady = true;











    return scene;
};

var engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
var scene = createScene();

   engine.runRenderLoop(function () {
	if (scene) {
		scene.render();
	}
});

// Resize
window.addEventListener("resize", function () {
	engine.resize();


	
});
