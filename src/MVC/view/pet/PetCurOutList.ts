/**
 * 当前出战的宠物
 */
class PetCurOutLine extends eui.Component{
    /**
     * 构造方法
     */
    public constructor() {
        super();
        this.skinName = "resource/game_skins/pet/PetCurOutListSkins.exml";
    }

    //实现接口
    // public get getId():number{
    //     return this.Pet ? 99999 : -1;
    // };
    
    /**
     * 更新
     */
    public update(pet:any):PetCurOutLine{
        this._pet = PetManager.fromData(pet);
        this.Render();
        return this;
    }

    /**
     * 子项创建完成
     */
    protected createChildren() {
        super.createChildren();
		// 等级技能的点击不响应
        this._scroller.horizontalScrollBar.autoVisibility = false;
        this._scroller.horizontalScrollBar.visible = false;
        this._scroller.horizontalScrollBar.touchEnabled = false;
        this._scroller.touchEnabled = false;
        this._scroller.touchChildren = false;
        this._upButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnUpLevelClick, this);
        this._petImage.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnImageClick, this);
        this._isCreat = true;

        this.Render();
    }

    /**
     * 刷新页面
     */
    public Render(){
        if(!this._isCreat) return;
        if(!this._pet) return;

        this._nameIma.source = this.Pet.NameRes;//<egret.Texture> await MovieManage.PromisifyGetRes(pet.NameRes);
        this._petImage.source = this.Pet.HeadRes;//<egret.Texture> await MovieManage.PromisifyGetRes(pet.HeadRes);
        // this._pet.Level = this.Pet.Level;
        
        this._levelLabel.text = "Lv." + this.Pet.Level.toString();
        this._gjLabel.text = Digit.fromObject(this.Pet.ori.b).ShowToString;

        let costMoney = this.Pet.UpLVMoney(PetWindow.curUpLevel);
        this._upMoneyNumString = costMoney.ShowToString;

        let oneAddGJNum = Digit.fromObject(this.Pet.ori.bn).Sub(Digit.fromObject(this.Pet.ori.b)).SetUpNum(PetWindow.curUpLevel).ShowToString;
        this._addGJNumString = "+" + oneAddGJNum;

        this._upButton.updateShow(0,[this._upMoneyNumString,this._addGJNumString]);

        this.oriSkill();
    }

    /**
     * 点击升级响应
     */
    private _OnUpLevelClick(event : TouchEvent){
        
        
        if (FacadeApp.read(CommandList.Re_Status).TestMoney(Digit.fromObject(this._pet.ori.m),true)){
            FacadeApp.fetchData([CommandList.M_NET_PetNum, "&oper=2", "&pm=" + PetWindow.curUpLevel], [data => {
                if (data["code"] == FacadeApp.SuccessCode){
                    SoundManager.PlayLvupMusic();
                    this._curSkillNum = this.Pet.Level;
                    FacadeApp.dispatchAction(CommandList.M_DAT_PetList, data['data']);
                    FacadeApp.dispatchAction(CommandList.M_DAT_Change_Money, data['data']['money']);
                    FacadeApp.dispatchAction(CommandList.M_AT_STATUS_Power, data['data']['power']);
                    FacadeApp.dispatchAction(CommandList.M_DAT_Status_PowerClick, data['data']['powerClick']);

                    this._ifShenjiAni = true;
                    FacadeApp.fetchData([CommandList.M_NET_STATUS], [data=>{
                        FacadeApp.dispatchAction(CommandList.M_AT_STATUSLIST, data['data']);
                    }]);
                    // this.creatAni("456");
                    // this.oriSkill();
                }
                else{
                    UIPage.inst(UIPage).ShowPrompt().ShowWindow(FacadeApp._errorCodeSet[data["code"]]);
                }
            }]);
        }
    }

    /**
     * 初始化技能显示,判断技能显示那个图标，是否解锁
     */
    public oriSkill(){

        this._petSkillArr = [this._skill1,this._skill2,this._skill3];

        this.judgeLevelSkill();

        if(this._ifShenjiAni){
            // console.log("升级");
            var las = this.Pet.Level - this._curSkillNum;

            // console.log("当前存的等级，于25："+this._curSkillNum%25,"升级的技术加上las："+this._curSkillNum%25,las);

            // 升级动画判断
            if(this._curSkillNum >= 10){
                if(las >= 25 || this._curSkillNum % 25 + las >= 25){
                    this._scroller.viewport.scrollH = 0;
                    this.creatSkillAni();
                }
            }
            else{
                if(las >= 10 || this._curSkillNum % 25 + las >= 10){
                    this._scroller.viewport.scrollH = 0;
                    this.creatSkillAni();
                }
            }
            this._ifShenjiAni = false;
            this._curSkillNum = this.Pet.Level;
        }
        else{
            if(this.Pet.Level >= 25)
                this._scroller.viewport.scrollH = 70;
            else
                this._scroller.viewport.scrollH = 0;
        }

    }

    /**
     * 技能判断显示
     */
    public judgeLevelSkill(){

        let _skillLevel:number[] = [11,26,50,75,100,125,150,175,200,1000];

        var _lastThousand:number = this.Pet.Level - this.Pet.Level % 1000;
        var _lastHundred:number = this.Pet.Level - this.Pet.Level % 25;

        for(var i:number=0; i<_skillLevel.length; i++){
            if(this.Pet.Level<_skillLevel[i]){
                if(i==0){
                    this._petSkillArr[0].updataPetShow(_skillLevel[i]-1,this.Pet._skillIDSet[i],this.Pet);
                    this._petSkillArr[1].updataPetShow(_skillLevel[i+1]-1,this.Pet._skillIDSet[i+1],this.Pet);
                    this._petSkillArr[2].updataPetShow(_skillLevel[i+2],this.Pet._skillIDSet[i+2],this.Pet);
                }
                else if(i==1){
                    this._petSkillArr[0].updataPetShow(_skillLevel[i-1]-1,this.Pet._skillIDSet[i-1],this.Pet);
                    this._petSkillArr[1].updataPetShow(_skillLevel[i]-1,this.Pet._skillIDSet[i],this.Pet);
                    this._petSkillArr[2].updataPetShow(_skillLevel[i+1],this.Pet._skillIDSet[i+1],this.Pet);
                }
                else if(i!=0 && i!=1 && i<=8){
                    this._petSkillArr[0].updataPetShow(_skillLevel[i-2],this.Pet._skillIDSet[i-2],this.Pet);
                    this._petSkillArr[1].updataPetShow(_skillLevel[i-1],this.Pet._skillIDSet[i-1],this.Pet);

                    if(this.Pet.Level % 1000 + 25 < 1000)
                        this._petSkillArr[2].updataPetShow(_lastHundred+25,this.Pet._skillIDSet[8],this.Pet);
                    else
                        this._petSkillArr[2].updataPetShow(_lastHundred+25,this.Pet._skillIDSet[9],this.Pet);
                }
                else{
                    this._petSkillArr[0].updataPetShow(_lastHundred-25,this.Pet._skillIDSet[8],this.Pet);
                    this._petSkillArr[1].updataPetShow(_lastHundred,this.Pet._skillIDSet[8],this.Pet);

                    if(this.Pet.Level % 1000 + 25 < 1000)
                        this._petSkillArr[2].updataPetShow(_lastHundred+25,this.Pet._skillIDSet[8],this.Pet);
                    else
                        this._petSkillArr[2].updataPetShow(_lastHundred+25,this.Pet._skillIDSet[9],this.Pet);
                }
                break;
            }
            else{
                if(this.Pet.Level % 1000 < 25){
                    this._petSkillArr[0].updataPetShow(_lastThousand-25,this.Pet._skillIDSet[8],this.Pet);
                    this._petSkillArr[1].updataPetShow(_lastThousand,this.Pet._skillIDSet[9],this.Pet);
                    this._petSkillArr[2].updataPetShow(_lastThousand+25,this.Pet._skillIDSet[8],this.Pet);
                }
                else{
                    this._petSkillArr[0].updataPetShow(_lastHundred-25,this.Pet._skillIDSet[8],this.Pet);
                    this._petSkillArr[1].updataPetShow(_lastHundred,this.Pet._skillIDSet[8],this.Pet);

                    if(this.Pet.Level % 1000 + 25 < 1000)
                        this._petSkillArr[2].updataPetShow(_lastHundred+25,this.Pet._skillIDSet[8],this.Pet);
                    else
                        this._petSkillArr[2].updataPetShow(_lastHundred+25,this.Pet._skillIDSet[9],this.Pet);
                }
            }
        }
    }

    /**
     * 创建技能升级动画
     */
    private creatSkillAni(){
        var pet:any=[this._skill1,this._skill2,this._skill3];

        MovieManage.GetDragonBonesMovie("shengji_tx",arm =>{
            var _armture : dragonBones.Armature = arm;
            this._group.addChild(_armture.display);
            
            if(this.Pet.Level >= 25){
                _armture.display.x = pet[1].x + pet[1].width/2;
                _armture.display.y = pet[1].y + pet[1].height/2;
                egret.Tween.removeTweens(this._scroller.viewport);
                this._scroller.viewport.scrollH = 0;
                egret.Tween.get(this._scroller.viewport).to({scrollH:70},1000);
            }
            else{
                _armture.display.x = pet[0].x + pet[0].width/2;
                _armture.display.y = pet[0].y + pet[0].height/2;
            }

            _armture.addEventListener(dragonBones.AnimationEvent.COMPLETE, function(){
                this._group.removeChild(_armture.display);
            },this);
            _armture.animation.gotoAndPlay("shengji_tx");
        },this);
    }


    /**
     * 显示物品
     */
    // public Render(){
    //     // RES.getResAsync(this.pet.Res+"_png",icon =>{ this._petImage.texture = icon},this);
    //     // RES.getResAsync(this.pet.Name+"_png",icon =>{ this._nameIma.texture = icon},this);
    //     console.log(this.Pet)
    //     // RES.getResAsync(this.pet.NameIma+"_png",icon =>{ this._nameIma.texture = icon},this);
    //     // this.UpdateShow(this.pet.Level);
    // }

    /**
     * 创建升级战力文字动画效果
     */
    private creatAni($num){   
        var label:eui.BitmapLabel =new eui.BitmapLabel();
        label.font = "upZLNum_fnt";
        label.text = $num;
        this.addChild(label);
        label.y = 80;
        label.x = this.width/2;

        egret.Tween.get(label).to({y:0,alpha:0},2000);
    }

	/**
     * 显示宠物
     * @param pet       需要显示的宠物
     */
    // public async ShowPet(pet: Pet){
    //     if (pet == null) return;

    //     this._pet = pet;
    //     this._nameIma.texture = <egret.Texture> await MovieManage.PromisifyGetRes(pet.NameRes);
    //     this._petImage.texture = <egret.Texture> await MovieManage.PromisifyGetRes(pet.HeadRes);
    //     // this._battleButton.enabled = !pet.IsFighting && pet.IsGet;
    //     // this._gjcsLabel.text = pet.AutoTimes.toString() + "次";
    // }

    /**
     * 取得宠物
     */
    public get Pet(): Pet{
        return this._pet;
    }

    /**
     * 图标点击响应
     */
    private _OnImageClick(event: egret.TouchEvent){
        UIPage.inst(UIPage).ShowPetDetail(this.Pet);
    }

    //  变量
    private _petImage : eui.Image;             // 图标
    private _nameIma : eui.Image;               // 名字
    private _levelLabel: eui.Label;             // 等级
    private _gjLabel: eui.Label;                // 攻击力

    private _upButton: LabelButton;               // 升级按钮

    private _upMoneyNumString : string;          // 升级金币
    private _addGJNumString : string;            // 增加攻击力

    private _pet: Pet;
    private _group : eui.Group;                 // 容器
    private _scroller : eui.Scroller            // 技能列表
    private _skill1 : SkillLine;             // 技能1
    private _skill2 : SkillLine;             // 技能2
    private _skill3 : SkillLine;             // 技能3

    private _petSkillArr:SkillLine[] = [];                // 技能组

    private _curSkillNum:number = -1;            // 当前技能等级

    private _ifShenjiAni: boolean = false;      // 是否升级
    private _isCreat: boolean = false;          // 是否创建完成

}