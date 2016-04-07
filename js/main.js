window.onload = function () {
    "use strict";
    var game = new Phaser.Game(800, 600, Phaser.AUTO, 'Rerack', { preload: preload, create: create, update: update });
    function preload() {
        game.load.tilemap('map', 'assets/map.json',null, Phaser.Tilemap.TILED_JSON);
        game.load.image('tiles', 'assets/tileset2.png');
        
        game.load.spritesheet('dude', 'assets/dude.png',32,48);
        
		game.load.audio('win',"assets/win.wav");
		
}
var player;
var enemy;
var platforms;
var cursors;
var background;
var gameover;
var win;
var stars;
var score = 0;
var scoreText;
var timer;
var currentTime;
var timerEvent;
var Event;
var skulls;
var map;
var layer;
var layer2;
    
function create() {
    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);
	player = game.add.sprite(32, game.world.height - 150, 'dude');
	map=game.add.tilemap('map');
	map.addTilesetImage('tileset2','tiles');
	layer=map.createLayer('background');
	layer2=map.createLayer('weights');
	//map.setCollisionBetween(1, 100000, true, 'weights');
	layer.resizeWorld();
    //  We need to enable physics on the player
    game.physics.arcade.enable(player);
    game.camera.follow(player);
    //  Player physics properties. Give the little guy a slight bounce.
   // player.body.bounce.y = 0.2;
    player.body.gravity.y = 0;
    player.body.collideWorldBounds = true;
	
    //  Our two animations, walking left and right.
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);
    //var facts =game.add.audio('facts'); 
    //  We need to enable physics on the player
    //  Player physics properties. Give the little guy a slight bounce.
    //  Finally some stars to collect
//    stars = game.add.group();
//    //  We will enable physics for any star that is created in this group
//    stars.enableBody = true;
//	var i;
//    //  Here we'll create 20 of them evenly spaced apart
//    for (i = 0; i < 20; i++)
//    {
//        //  Create a star inside of the 'stars' group
//        var star = stars.create(i * 70, 1, 'star');
//        star.body.velocity.setTo(200,200);
//        star.body.collideWorldBounds=true;
//		star.body.gravity.y=0;
//        star.body.bounce.y = 0.7 + Math.random() * 0.2;
//        star.body.bounce.x=  0.7 + Math.random() * 0.2;
//    }
//    skulls=game.add.group();
//    skulls.enableBody=true;
//    for (i = 0; i < 2; i++)
//    {
//        //  Create a star inside of the 'stars' group
//        var skull = skulls.create(i * 150, 1, 'skull');
//        skull.body.velocity.setTo(200,200);
//        skull.body.collideWorldBounds=true;
//		skull.body.gravity.y=0;
//        skull.body.bounce.y = 0.7 + Math.random() * 0.2;
//        skull.body.bounce.x=  0.7 + Math.random() * 0.2;
//    }
    //  The score
    scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
    timer= game.time.create();
    timerEvent= timer.add(Phaser.Timer.MINUTE*2+ Phaser.Timer.SECOND *0, this.endTimer,this);
    timer.start();
   // timer = game.add.text(game.world.centerX+250, 16, '00:00:00', { fontSize: '32px', fill: '#000' });
     // Our controls.
	//createItems();
   cursors = game.input.keyboard.createCursorKeys();
    
}
//	 function findObjectsByType(type, map, layer) {
//    var result = new Array();
//    map.objects[layer].forEach(function(element){
//      if(element.properties.type === type) {
//        //Phaser uses top left, Tiled bottom left so we have to adjust
//        //also keep in mind that the cup images are a bit smaller than the tile which is 16x16
//        //so they might not be placed in the exact position as in Tiled
//        element.y -= map.tileHeight;
//        result.push(element);
//      }      
//    });
//    return result;
//  }
//	function createFromTiledObject(element, group) {
//    var sprite = group.create(element.x, element.y, element.properties.sprite);
// 
//      //copy all properties to the sprite
//      Object.keys(element.properties).forEach(function(key){
//        sprite[key] = element.properties[key];
//      });
//  }
//	 function createItems() {
//    //create items
//	var items;
//    items = game.add.group();
//    items.enableBody = true;
//    var item;    
//    result = findObjectsByType('25lbs', map, 'weights');
//    result.forEach(function(element){
//      createFromTiledObject(element, items);
//    }, this);
//  }
  //find objects in a Tiled layer that containt a property called "type" equal to a certain value
 
  //create a sprite from an object
  
function update() { 
    //  Collide the player and the stars with the platforms
   // game.physics.arcade.collide(player, platforms);
	 //game.physics.arcade.collide(enemy, platforms);
 //   game.physics.arcade.collide(stars, platforms);
    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    game.physics.arcade.overlap(player, stars, collectStar, null, this);
    game.physics.arcade.overlap(player,skulls,explode,null,this);
	game.physics.arcade.overlap(player,layer);
	game.world.bringToTop(player);
	
    //  Reset the players velocity (movement)
    player.body.velocity.x = 0;
	 player.body.velocity.y = 0;
    if (cursors.left.isDown)
    {
        //  Move to the left
        player.body.velocity.x -= 50;

        player.animations.play('left');
    }
    else if (cursors.right.isDown)
    {
        //  Move to the right
        player.body.velocity.x += 50;

        player.animations.play('right');
    }
    else
    {
        //  Stand still
        player.animations.stop();

        player.frame = 4;
    }

    //  Allow the player to jump if they are touching the ground.
    if (cursors.up.isDown)
    {
        player.body.velocity.y -= 50;
    }
	if (cursors.down.isDown)
    {
        player.body.velocity.y += 50;
    }
    //  Allow the player to jump if they are touching the ground.
//     if(stars.countLiving()==0)
//        {
//			var win =game.add.audio('win');
//			win.play();
//      var goText = this.game.add.text(game.world.centerX-100,game.world.centerY,' ', { font: '40px Arial', fill: '#D80000', align: 'center' });
//            goText.text="You Win!!";
//       goText.visible=true;
//        player.kill();
//            timer.stop();
//        }
render();
}
    function formatTime(s) {
        // Convert seconds (s) to a nicely formatted and padded time string
        var minutes = "0" + Math.floor(s / 60);
        var seconds = "0" + (s - minutes * 60);
        return minutes.substr(-2) + ":" + seconds.substr(-2);   
    }
    function render()
    {
		//game.debug.body(player);
		var text = formatTime(Math.round((timerEvent.delay - timer.ms) / 1000));
        if (timer.running) {
      game.debug.text(text, game.world.centerX+300, 16, "#ff0");
        }
    }
function explode(player,skull)
    {
        player.kill();
		var rando = Math.floor((Math.random() *3))+1;
		
        var terminated =game.add.audio('terminated');
		var death =game.add.audio('death');
		var laugh =game.add.audio('laugh');
		if(rando == 1)
			{
        terminated.play();
			}
		if(rando == 2)
			{
        death.play();
			}
		if(rando == 3)
			{
        laugh.play();
			}
         var goText = this.game.add.text(game.world.centerX-100,game.world.centerY,' ', { font: '40px Arial', fill: '#D80000', align: 'center' });
            goText.text="Game Over\n You Died!!";
       goText.visible=true;
        timer.stop();
       // game.input.onTap.addOnce(restart,this);
    }
function collectStar (player, star) {
    
    // Removes the star from the screen
    star.kill();
    var collected =game.add.audio('collected');
        collected.play();
    //  Add and update the score
    score += 10;
    scoreText.text = 'Score: ' + score;
   
  
}
};