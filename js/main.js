window.onload = function() {
    // You might want to start with a template that uses GameStates:
    //     https://github.com/photonstorm/phaser/tree/master/resources/Project%20Templates/Basic
    
    // You can copy-and-paste the code from any of the examples at http://examples.phaser.io here.
    // You will need to change the fourth parameter to "new Phaser.Game()" from
    // 'phaser-example' to 'game', which is the id of the HTML element where we
    // want the game to go.
    // The assets (and code) can be found at: https://github.com/photonstorm/phaser/tree/master/examples/assets
    // You will need to change the paths you pass to "game.load.image()" or any other
    // loading functions to reflect where you are putting the assets.
    // All loading functions will typically all be found inside "preload()".
    
    "use strict";
    
    var game = new Phaser.Game( 800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );
    
    function preload() {
        // Load an image and call it 'logo'.
        game.load.tilemap('world', 'assets/world.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap('obstacle', 'assets/killer.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image( 'gameTiles', 'assets/tiles.png' );
        game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
        game.load.image('phone', 'assets/phone.jpg');
        game.load.image('door', 'assets/castledoors.png');
    }
    var player;
    var cursors;
    
    var phone;
    var phones;
    var score = 0;
    var door;
    
    var map;
    var backgroundLayer;
    var blockedLayer;
    
    var map2;
    var obstacleLayer;
    
    var level = 1;
    var over = false;
    
    function create() 
    {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        map = game.add.tilemap('world');
        map.addTilesetImage('tiles', 'gameTiles');
        
        blockedLayer = map.createLayer('BlockLayer');
        
        map.setCollisionBetween(1, 4000, true, 'BlockLayer');
        blockedLayer.resizeWorld();
        
        backgroundLayer = map.createLayer('BackgroundLayer');
        backgroundLayer.resizeWorld();
        
        map2 = game.add.tilemap('obstacle');
        map2.addTilesetImage('tiles', 'gameTiles');
        obstacleLayer = map2.createLayer('ObstacleLayer');
        
        map2.setCollisionBetween(1, 4000, true, 'ObstacleLayer');
        obstacleLayer.resizeWorld();
        
        player = game.add.sprite(100, game.world.height - 150, 'dude');
	 
    	game.physics.enable(player);
	game.camera.follow(player);
	
	player.body.bounce.y = 0.2;
	player.body.gravity.y = 300;
		
	player.animations.add('left', [0, 1, 2, 3], 10, true);
	player.animations.add('right', [5, 6, 7, 8], 10, true);
	
	//set to zero and add function for user to click
	player.body.velocity.x = 150 + level * 10;
	
	phones = game.add.group();
	phones.enableBody = true;
	createPhone();
	
	cursors = game.input.keyboard.createCursorKeys();
    }
    
    function update() 
    {
    	game.physics.arcade.collide(player, blockedLayer);
    	//add game over if collision
    	game.physics.arcade.collide(player, obstacleLayer, gameover, null, this);
    	game.physics.arcade.collide(player, phones, collectPhones, null, this);
    	
	if (cursors.left.isDown && over == false)
	{
		player.body.velocity.x = 50 + level * 10;
	}
	else if (!cursors.left.isDown && over == false)
	{
    		player.body.velocity.x = 150 + level * 10;
	}
     	player.animations.play('right');
     	
    	if (cursors.up.isDown && player.body.onFloor() && over == false)
    	{
    		player.body.velocity.y = -250;
    	}
    }
    
    function createPhone()
    {
    	phone = phones.create(game.rnd.integerInRange(100,500), 500, 'phone');
    	phone = phones.create(game.rnd.integerInRange(600,1000), 500, 'phone');
    	phone = phones.create(game.rnd.integerInRange(1100,1500), 500, 'phone');
    	phone = phones.create(game.rnd.integerInRange(1600,2000), 500, 'phone');
    }
    
    function collectPhones()
    {
    	remove(phone, true);
    	score++;
    	var scoreText = game.add.text(0, 0, 'Score: ' + score, { fontSize: '128px', fill: 'red' });
    	scoreText.fixedToCamera = true;
    }
    
    function gameover()
    { 
    	over = true;
	player.body.velocity.x = 0;
	player.animations.stop();
	player.frame = 4;
	var gameoverText = game.add.text(350, 300, 'Game Over', { fontSize: '128px', fill: 'red' });
	gameoverText.fixedToCamera = true;
    }
};
