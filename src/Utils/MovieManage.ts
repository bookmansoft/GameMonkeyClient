/**
 * 动画数据管理
 */
class MovieManage {
    /**
     * 取得帧动画数据
     * @param jsonName                  json配置文件名
     * @param textureName               动画图片文件名
     * @param movieName                 动画名
     * @return egret.MovieClipData      动画数据
     */
    public static async GetMovieClipData(jsonName: string, textureName: string, movieName: string) {
        if (MovieManage._movieDataFactorySet == null) {
            MovieManage._movieDataFactorySet = [];
        }
        let data = await MovieManage.PromisifyGetRes(jsonName, this);
        let texture:egret.Texture = <egret.Texture> await MovieManage.PromisifyGetRes(textureName, this);
        var key: string = jsonName + textureName;
        var mcDataFactory: egret.MovieClipDataFactory;
        mcDataFactory = MovieManage._movieDataFactorySet[key];
        if (mcDataFactory == null) {
            mcDataFactory = new egret.MovieClipDataFactory(data, texture);
            MovieManage._movieDataFactorySet[key] = mcDataFactory;
        }
        var movieData: egret.MovieClipData = mcDataFactory.generateMovieClipData(movieName);
        return movieData;
    }
    
    /**
     * 返回RES.getResAsync的Promise封装
     */
    public static PromisifyGetRes(res:string, self?:any){
        return new Promise( (resolve, reject) => {
            try{
                RES.getResAsync(res, star => {
                    resolve(star);
                }, self);
            }
            catch(e){
                reject(e); 
            }
        });
    }

    /**
     * 异步方式获取一个资源列表中的全部资源，list为全部资源名称组成的数组
     * 当所有资源全部下载并加载成功后，调用回调函数，并以数组形式返回全部资源
     */
    public static getResList(list:Array<string>, func:any, obj:any){
        let result = 0;
        for(let i = 0; i< list.length; i++){
            result = result | 1<<i;
        }
        
        let processStatus = 0; //完成状态集
        let checker = [];
        let recy = 0;
        list.map(url=>{
            let cur = recy++;
            RES.getResAsync(url, data => {
                checker[cur] = data;
                processStatus = Indicator.getInstance(processStatus).set(1<<cur).indecate;
                if (Indicator.getChecker(processStatus)(result)) {
                    func.call(obj, checker);
                }
            }, this);
        })
    }

    /**
     * GetDragonBonesMovie的Promise封装
     */
    public static PromisifyGetDragonBonesMovie(res:string, self:any){
        return new Promise( (resolve, reject) => {
            try{
                MovieManage.GetDragonBonesMovie(res, star => {
                    resolve(star);
                }, self);
            }
            catch(e){
                reject(e); 
            }
        });
    }

    /**
     * 取得骨骼动画数据  监听事件：armature.addEventListener( dragonBones.AnimationEvent.START, this.startPlay,this);案例：var amature: dragonBones.Armature = MovieManage.GetDragonBonesMovie("cat"); this.addChild(amature.display);amature.animation.gotoAndPlay("catfree");
     * @param armatureName                  骨架名
     * @return dragonBones.Armature         动画数据
     * 
     * @note 如果传入func和obj参数，表示异步获取（资源可以不必事先加载），否则为直接获取（资源必须事先加载好）
     */
    public static GetDragonBonesMovie(armatureName: string = "", func?:any, obj?:any): dragonBones.Armature {
        // 动画配置文件名
        var movieDataName = armatureName + "_json";
        // 动画资源配置名
        var texturejsonName = armatureName + "texture_json";
        // 动画资源图片名
        var textureName = armatureName+"texture_png";
        if (this._dragonBonesFactory == null) 
        {
            this._dragonBonesFactory = new dragonBones.EgretFactory();
        }
        if (MovieManage._dragonMovieSet == null) MovieManage._dragonMovieSet = [];

        if(func){//异步资源获取,将多个资源一并下载好，以数组形式同时返回
            this.getResList([movieDataName,texturejsonName,textureName], list => {
                var skeletonData = list[0];
                var textureData = list[1];
                var texture = list[2];
                if (MovieManage._dragonMovieSet[movieDataName] == null){
                    MovieManage._dragonBonesFactory.addSkeletonData(dragonBones.DataParser.parseDragonBonesData(skeletonData));
                    MovieManage._dragonBonesFactory.addTextureAtlas(new dragonBones.EgretTextureAtlas(texture, textureData));
                    MovieManage._dragonMovieSet[movieDataName] = "1";
                }
                var armature = MovieManage._dragonBonesFactory.buildArmature(armatureName);
                MovieManage.ADDArmature(armature);
                if (!MovieManage._isTickerRegister) {
                    egret.Ticker.getInstance().register(function (advancedTime) {
                        dragonBones.WorldClock.clock.advanceTime(advancedTime / 1000);
                    }, this);
                    MovieManage._isTickerRegister = true;
                }
                func.call(obj, armature);
            }, this);
        }
        else{//同步资源读取
            if (MovieManage._dragonMovieSet[movieDataName] == null){
                var skeletonData = RES.getRes(movieDataName);
                var textureData = RES.getRes(texturejsonName);
                var texture = RES.getRes(textureName);
                if (skeletonData == null) {
                    console.log("Data:" + movieDataName);
                }
                if (textureData == null) {
                    console.log("Texturejson:" + texturejsonName);
                }
                if (texture == null) {
                    console.log("Texture:" + textureName);
                }
                MovieManage._dragonBonesFactory.addSkeletonData(dragonBones.DataParser.parseDragonBonesData(skeletonData));
                MovieManage._dragonBonesFactory.addTextureAtlas(new dragonBones.EgretTextureAtlas(texture, textureData));
                MovieManage._dragonMovieSet[movieDataName] = "1";
            }
            var armature = MovieManage._dragonBonesFactory.buildArmature(armatureName);
            MovieManage.ADDArmature(armature);
            if (!MovieManage._isTickerRegister) {
                egret.Ticker.getInstance().register(function (advancedTime) {
                    dragonBones.WorldClock.clock.advanceTime(advancedTime / 1000);
                }, this);
                MovieManage._isTickerRegister = true;
            }
            return armature;
        }
    }
    
    /**
     * 添加骨骼动画数据
     * @param armature                  动画数据
     */
    public static ADDArmature(armature: dragonBones.Armature) {
        if (armature != null && !dragonBones.WorldClock.clock.contains(armature)) {
            dragonBones.WorldClock.clock.add(armature);
        }
    }
    
    /**
     * 移除骨骼动画数据
     * @param armature                  动画数据
     */
    public static RemoveArmature(armature: dragonBones.Armature) {
        if (armature != null && dragonBones.WorldClock.clock.contains(armature)) {
            dragonBones.WorldClock.clock.remove(armature);
        }
    }

    // 变量
    private static _isTickerRegister: boolean = false;                      // 是否注册动画时间响应
    private static _movieDataFactorySet: egret.MovieClipDataFactory[];      // 帧动画工厂
    private static _dragonBonesFactory: dragonBones.EgretFactory;           // 骨骼动画工厂
    private static _dragonMovieSet: string[];                               // 已有龙骨集合
} 