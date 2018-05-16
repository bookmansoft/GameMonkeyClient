class physicsWorld
{
    /**
     * 建立并返回刚体p2的世界对象，由于egret和p2.js两者的坐标系彼此独立，需要手动转换：
     * 
     * 1. 转换坐标和度量
     *    p2.js坐标原点左下角，向上向右（重力为负）
     *    egert坐标原点左上角，向右向下
     *    p2.js使用MKS(米 千克 秒),egert使用px像素
     * 
     * 2. 将egert图元贴到p2.js body上
     *    p2body.displays = [egert里面的displayobject]
     */
    public static get world(){
        if(this._world == null){
            //创建world
            var world: p2.World = new p2.World({
                gravity: [0, physicsWorld.params.gravity]
            });
            world.sleepMode = p2.World.BODY_SLEEPING;

            //创建地面
            var groundShape: p2.Plane = new p2.Plane(); //在p2.js中默认从原点扩展为平面
            var groundBody: p2.Body = new p2.Body({
                position: [0, physicsWorld.params.landline / physicsWorld.params.factor], //地平线
                mass: 0 //在p2.js中，质量为0的物体不会动
            });
            groundBody.addShape(groundShape);
            groundBody.displays = [];
            world.addBody(groundBody);
            world.defaultContactMaterial.restitution = 0.7;

            // 设置两种材料间的表面系数
            // var CoinsMaterial: p2.ContactMaterial = new p2.ContactMaterial(physicsWorld.params.coinMaterial, physicsWorld.params.coinMaterial, {
            //     friction: 0.3,
            //     restitution: 0.5,
            //     stiffness: 0,
            //     relaxation: 0,
            //     frictionStiffness: 0,
            //     frictionRelaxation: 0,
            //     surfaceVelocity: 0
            // });
            //world.addContactMaterial(groundCoinMaterial);

            this._world = world;

            //p2.js的世界时间流逝
            egret.Ticker.getInstance().register((dt: number) => {
                if (dt < 10 || dt > 1000) { //???
                    return;
                }
                physicsWorld.world.step(dt / physicsWorld.params.timeGear);

                let stageHeight: number = egret.MainContext.instance.stage.stageHeight;
                let l = physicsWorld.world.bodies.length;
                let removeList:Array<p2.Body> = [];
                for (let i: number = 0; i < l; i++) {
                    let boxBody: p2.Body = physicsWorld.world.bodies[i];
                    let box: egret.DisplayObject = boxBody.displays[0];
                    let sharp = boxBody.shapes[0];
                    if (box && sharp) {
                        /*
                         * 物体下落时：
                         * egert    y坐标变大(正数)
                         * p2.js    y坐标减小(正数)
                         * 二者之和就是屏幕高度
                         */ 
                        box.x = boxBody.position[0] * physicsWorld.params.factor;
                        box.y = stageHeight - boxBody.position[1] * physicsWorld.params.factor;
                        box.rotation = 360 - (boxBody.angle + sharp.angle) * 180 / Math.PI;
                        if (boxBody.sleepState == p2.Body.SLEEPING
                            || box.x < 20 || box.x > egret.MainContext.instance.stage.stageWidth - 20
                        ) {
                            removeList.push(boxBody);
                        }
                    }
                }

                removeList.map(boxBody=>{
                    let box: egret.DisplayObject = boxBody.displays[0];
                    if(box){
                        let $x = 66;//SoldierManage.FightManager.GetInstance().armyOfMine.pet.x;
                        let $y = 36;//SoldierManage.FightManager.GetInstance().armyOfMine.pet.y - 80;
                        // console.log({x:$x, y:$y});
                        egret.Tween.get(box)
                            .to({alpha:0}, 0)
                            .wait(80)
                            .to({alpha:1}, 0)
                            .wait(80)
                            .to({alpha:0}, 0)
                            .wait(80)
                            .to({alpha:1}, 0)
                            .wait(80)
                            .to({x:$x, y:$y},300)
                            .call(function(){
                                if(box.parent){
                                    ObjectPool.getPool('egret.Bitmap').returnObject(box);
                                    box.parent.removeChild(box);
                                }

                                let sj1: eui.Image = ObjectPool.getPool('eui.Image').borrowObject();
                                RES.getResAsync("foguang_fp02_png", img => {
                                    sj1.source = img;
                                    sj1.anchorOffsetX = 0;
                                    sj1.anchorOffsetY = 0;
                                    sj1.x = $x - 25;
                                    sj1.y = $y - 25;
                                    UIPage.inst(UIPage).EffectGroup.addChild(sj1);
                                    setTimeout(()=>{
                                        ObjectPool.getPool('egret.Bitmap').returnObject(sj1);
                                        sj1.parent.removeChild(sj1);
                                    }, 50);
                                }, this);
                            });

                        if(boxBody.shapes[0]){
                            ObjectPool.getPool('p2.Circle').returnObject(boxBody.shapes[0]);
                            boxBody.removeShape(boxBody.shapes[0]);
                        }

                        ObjectPool.getPool('p2.Body').returnObject(boxBody);
                        physicsWorld._world.removeBody(boxBody);
                    }
                });
            }, self);
        }
        return this._world;
    }
    private static _world:p2.World = null;    
    private static params = {
        factor: 50, //转换因子，设定p2.js的一米长度是egert中屏幕的Xpx
        landline: 450,  //地平线
        timeGear: 1000, //时间变换因子
        gravity: -9.82*6,   //重力加速度
        coinMaterial: new p2.Material(1)     //金币材质
    };

    /**
     * 1、随机生成一个刚体，并使用指定贴图
     * 2、赋予该刚体一个初始速度，以及一定的受力，缺省让重力作为唯一受力
     * 3、点击该刚体，给予其一个向上的动能以改变其运动轨迹，未来可以和滑屏、弹击Boss等结合
     * 4、合适的时机下，销毁刚体，例如超出屏显范围
     */
    public static async addOneBox(res:string, x:number, y:number, sum:number, self) {
        for(let i =0; i< sum; i++){
            //创建刚体：指定其半径
            let boxSharp:p2.Circle = ObjectPool.getPool('p2.Circle').borrowObject();
            boxSharp.radius = 0.45;
            boxSharp.material = physicsWorld.params.coinMaterial;
            let boxBody: p2.Body = ObjectPool.getPool('p2.Body').borrowObject({ 
                mass: Math.ceil(Math.random()*10),    //质量
                position: [Math.floor(x / physicsWorld.params.factor), Math.floor((egret.MainContext.instance.stage.stageHeight - y + 150) / physicsWorld.params.factor)], //初始位置
                angle: 0,           //初始角度
                velocity: [Math.floor(Math.random()*12)-6, Math.ceil(Math.random()*20)+15],    //移动速度
                angularVelocity: 3 //旋转速度
            });
            //从缓冲池取出后，部分属性重新设置下
            boxBody.displays = [];
            boxBody.shapes = [];
            boxBody.position = [Math.floor(x / physicsWorld.params.factor), Math.floor((egret.MainContext.instance.stage.stageHeight - y + 150) / physicsWorld.params.factor)]; //初始位置
            boxBody.velocity = [Math.floor(Math.random()*12)-6, Math.ceil(Math.random()*20)+15],    //移动速度
            boxBody.addShape(boxSharp);

            //施加外力 - 暂时用不上
            // var ap = p2.vec2.fromValues(1,0),
            // newForce = p2.vec2.create();
            // p2.vec2.scale(newForce, ap, boxBody.mass); // f = m*g
            // p2.vec2.add(boxBody.force, boxBody.force, newForce);  // f += fn

            //碰撞检测，还可以分组
            // let aire = Math.pow(2,0);    //不与任何物体碰撞
            // let player = Math.pow(2,1);
            // let enemy = Math.pow(2,2);
            // let ground = Math.pow(2,31); //可以与任何物体碰撞
            // boxSharp.collisionGroup = player;
            // boxSharp.collisionMask = enemy | ground; //but not another player

            //todo: 摩擦力 

            //创建图形
            let img = ObjectPool.getPool('egret.Bitmap').borrowObject();
            img.texture = <egret.Texture> await MovieManage.PromisifyGetRes(res); //异步获取资源，获取后再向下执行
            let display: egret.DisplayObject = img;
            display.x = x;
            display.y = y;

            //添加到舞台
            self.addChild(display);
            display.width = (<p2.Circle>boxSharp).radius * 2 * physicsWorld.params.factor;
            display.height = (<p2.Circle>boxSharp).radius * 2 * physicsWorld.params.factor;
            display.anchorOffsetX = display.width / 2;
            display.anchorOffsetY = display.height / 2;

            //绑定刚体和图形
            boxBody.displays = [display];

            //添加刚体到世界
            physicsWorld.world.addBody(boxBody);
        }
    }
	/**
	 * 金币移动动画
	 * 缩放比例
	 */
	public static async jinbiAniFfun($sca,$oriX,$oriY,$width,$height, self:any)
	{
        var jinbiIma:eui.Image = ObjectPool.getPool('eui.Image').borrowObject();
        jinbiIma.texture = <egret.Texture> await MovieManage.PromisifyGetRes('jinbi_png', self);
        self.addChild(jinbiIma);

        jinbiIma.x = $oriX;
        jinbiIma.y = $oriY-$height*0.8;
        jinbiIma.scaleX = 0.2;
        jinbiIma.scaleY = 0.2;
        jinbiIma.alpha = 0;

        var moveX:number = Math.floor(Math.random() * ($width*2)-$width);
        if(moveX>0) var der:number = 1;
        else der = -1;
        var moveY:number = Math.floor(Math.random()*10+10);

        egret.Tween.get(jinbiIma)
            .to({alpha:1,scaleX:$sca,scaleY:$sca},200)
            .to({y:630},300)
            .to({y:630-50,x:jinbiIma.x-moveX/4},100)
            .to({y:630,x:jinbiIma.x-moveX/3},100)
            .to({y:630-30,x:jinbiIma.x-moveX/2},50)
            .to({y:630,x:jinbiIma.x-moveX},50)
            .to({y:630,x:jinbiIma.x-moveX-der*10},30)
            .wait(1500).call(function(){
                this.removeChild(jinbiIma);
                ObjectPool.getPool('eui.Image').returnObject(jinbiIma);
            }.bind(self));
	}
}