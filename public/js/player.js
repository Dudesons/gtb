"use strict";

var Player = {
    Init: function(obj)
            {
                Player.GenPlayer(obj.mesh);
                Player.Life.Init();
                Player.Timer.Init();

            },

    GenPlayer: function(mesh)
                {
                    Main.player.model.body = mesh;
                    Main.player.model.body.scaling = new BABYLON.Vector3(3, 3, 3);
                   // Main.player = BABYLON.Mesh.CreateBox("player", 2, Main.scene);
                    //Main.player = BABYLON.Mesh.
                    Main.player.model.body.position.y = 3.0;
                    Main.player.model.body.position.x = 18.0;
                    Main.player.model.body.position.z = 6.0;
                    Main.player.model.body.rotation.y = -(Math.PI/1.65);
                    //Main.player.model.body.material = new BABYLON.StandardMaterial("player", Main.scene);
                    //Main.player.model.body.material.diffuseTexture = new BABYLON.Texture("public/img/spiderman.png", Main.scene);
                },
    Timer: {
        Init: function()
                {
                    Main.player.model.timebar = BABYLON.Mesh.CreateBox("playertime", 2, Main.scene);
                    Main.player.model.timebar.scaling = new BABYLON.Vector3(1, 0.05, 0.05);
                    Main.player.model.timebar.parent = Main.player.model.body;
                    Main.player.model.timebar.position.y = 2.8;
                    Main.player.model.timebar.position.x = 2.0;
                    Main.player.model.timebar.rotation.y = -2.5;
                    //.diffuseColor = new BABYLON.Color3(1.0, 0.2, 0.7);
                    Main.player.model.timebar.material = new BABYLON.StandardMaterial("texture1", Main.scene);
                    Main.player.model.timebar.material.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5);
                },
        Update: function(progress)
                {
                    Main.player.model.timebar.scaling = new BABYLON.Vector3((10 - progress) / 10, 0.05, 0.05);
                    Main.player.model.timebar.material.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5);
                }
    },

    Life: {
        Init: function()
                {
                    Main.player.model.lifebar = BABYLON.Mesh.CreateBox("playerlife", 2, Main.scene);
                    Main.player.model.lifebar.scaling = new BABYLON.Vector3(1, 0.1, 0.1);
                    Main.player.model.lifebar.parent = Main.player.model.body;
                    Main.player.model.lifebar.position.y = 2.5;
                    Main.player.model.lifebar.position.x = 2.0;
                    Main.player.model.lifebar.rotation.y = -2.5;
                    //.diffuseColor = new BABYLON.Color3(1.0, 0.2, 0.7);
                    Main.player.model.lifebar.material = new BABYLON.StandardMaterial("texture1", Main.scene);
                    Main.player.model.lifebar.material.diffuseColor = new BABYLON.Color3(0, 1, 0);

                },
        Update: function(dom)
                {
                    if(Main.endMatch == 0 && Main.player.data.hp >= 0)
                    {
                        Main.player.data.hp = Main.player.data.hp-dom;
                        Main.player.model.lifebar.scaling = new BABYLON.Vector3(Main.player.data.hp, 0.1, 0.1);
                        Main.player.model.lifebar.material.diffuseColor = Main.player.data.hp >= 0.5 ? new BABYLON.Color3(0, 1, 0) : Main.player.data.hp >= 0.3 ? new BABYLON.Color3(0.9, 0.4, 0) : new BABYLON.Color3(1, 0, 0);
                    }
                    else
                    {
                        Monster.Label.Write("Vous êtes mort");
                        Player.Life.Dead();
                        setTimeout(function()
                                    {

                            window.location = "index.html?index.html?data={ \"del\" : " + Main.monster.data.id + ", \"items\":" + JSON.stringify(Main.items.data) + "}";
                                    }, 5000);
                    }
                },

        Dead: function()
        {
                    if (Main.endMatch == 0 && Main.player.data.hp <= 0)
                    {
                        var pos = Main.player.model.body.position;
                        Main.player.model.body.dispose();
                        //var dead = BABYLON.Mesh.CreateBox("dead", 10, Main.scene);
                        Main.cross.isVisible = true;
                        Main.cross.material = new BABYLON.StandardMaterial("dead", Main.scene);
                        Main.cross.material.diffuseTexture = new BABYLON.Texture("public/img/CelticCross.png", Main.scene);
                        Main.cross.scaling = new BABYLON.Vector3(2, 2, 2);
                        Main.cross.position = pos;
                        Main.cross.position.y += 5;
                        Main.cross.checkCollisions = true;
                        Main.cross.setPhysicsState(BABYLON.PhysicsEngine.BoxImpostor, { mass: 1 });
                        Main.endMatch = 1;

                    }
                }
    },

    UserSkill: function(id)
                {
                    var skillId = id;
                    if(Main.action == 0 && Main.items.data[0].qty >= Main.skills.data[skillId].cost && Main.endMatch == 0)
                    {
                        Main.items.data[0].qty -= Main.skills.data[skillId].cost;
                        for(var i = 0; i < Main.skills.data[skillId].cost; i++)
                        {
                            /*Main.items.model[Main.items.model.length - 1].dispose();
                            Main.items.model.pop();*/
                        }
                        Monster.Life.Update(Main.skills.data[skillId].dmg);
                        Main.action = 1;
                        setTimeout(function()
                                    {
                                        if (Main.endMatch == 0)
                                        {
                                            Player.Life.Update(Main.skills.data[((Math.floor(Math.random() * (Main.monster.data.skills.length -1)) + 1)-1)].dmg);
                                            Main.action = 0;
                                        }
                                    }, 3000);
                    }
            },

    Animation: {
        Anim0: function(func)
                {
                    var animationBox0 = new BABYLON.Animation("anim0", "position.x", 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
                    var animationBox1 = new BABYLON.Animation("anim1", "rotation.x", 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
                    var animationBox2 = new BABYLON.Animation("anim2", "position.x", 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

                    var posX = Main.player.model.body.position.x;

                    var keys0 = [];
                    keys0.push({
                        frame: 0,
                        value: posX
                    });
                    keys0.push({
                        frame: 100,
                        value: Main.monster.model.body.position.x + 8
                    });
                    animationBox0.setKeys(keys0);
                    Main.player.model.body.animations.push(animationBox0);

                    //Main.scene.beginAnimation(Main.player.model.body, 0, 100, true);
                    var keys1 = [];
                    keys1.push({
                        frame: 0,
                        value: 0
                    });
                    keys1.push({
                        frame: 20,
                        value: Math.PI/4
                    });
                    keys1.push({
                        frame: 100,
                        value: 0
                    });
                    animationBox1.setKeys(keys1);
                    Main.player.model.body.animations.push(animationBox1);

                    var keys2 = [];
                    keys2.push({
                        frame: 0,
                        value: Main.monster.model.body.position.x
                    });
                    keys2.push({
                        frame: 100,
                        value: posX
                    });
                    animationBox2.setKeys(keys2);
                    Main.player.model.body.animations.push(animationBox2);

                    Main.scene.beginDirectAnimation(Main.player.model.body, [animationBox0], 0, 100, false, 1, function()
                                                                                                                {
                                                                                                                    Main.scene.beginDirectAnimation(Main.player.model.body, [animationBox1], 0, 100, false, 1, function()
                                                                                                                                                                        {
                                                                                                                                                                            Main.scene.beginDirectAnimation(Main.player.model.body, [animationBox2], 0, 100, false, 1, function()
                                                                                                                                                                                                                                {

                                                                                                                                                                                                                                });
                                                                                                                                                                        });
                                                                                                                });
                    func()
                }

    }
};