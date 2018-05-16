/**
 * 法宝行
 */
class TalismanLine extends eui.Component implements IGroupLine{
    /**
     * 构造方法
     */
    public constructor() {
        super();
        this.skinName = "resource/game_skins/talisman/TalismanListSkins.exml";
    }

    //实现接口
    public get getId():number{
        return this.talisman ? this.talisman.ID : -1;
    };

    /**
     * 更新
     */
    public update(talisman:any):TalismanLine{
        this.talisman = TalismanManager.fromData(talisman);
        this.Render();
        return this;
    }
    //End

    /**
     * 子项创建完成
     */
    protected createChildren() {
        super.createChildren();

        this._scroller.horizontalScrollBar.autoVisibility = false;
        this._scroller.horizontalScrollBar.visible = false;
        this._scroller.horizontalScrollBar.touchEnabled = false;
        this._scroller.touchEnabled = false;
        this._scroller.touchChildren = false;

        // 测试 高亮
        // this.changeState("gaoliang");

        this._upButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnUpLevelClick, this);
        this._iconIma.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnImageClick, this);
    }

    /**
     * 显示物品
     */
    public Render(){
        RES.getResAsync(this.talisman.NameRes + "_png", icon => { 
            this._nameIma.texture = icon;
        }, this);
        RES.getResAsync(this.talisman.Icon + "_png", icon => { this._iconIma.texture = icon}, this);

        this._levelLabel.text = "Lv." + this.talisman.Level.toString();
        this._gjLabel.text = Digit.fromObject(this.talisman.ori.b).ShowToString;
        

        // 消耗金币，战力
        let costMoney = this.talisman.UpLVMoney(TalismanWindow.curUpLevel);
        this._upMoneyNumString = costMoney.ShowToString;

        let oneAddGJNum = Digit.fromObject(this.talisman.ori.bn).Sub(Digit.fromObject(this.talisman.ori.b)).SetUpNum(TalismanWindow.curUpLevel).ShowToString;
        this._addGJNumString = "+" + oneAddGJNum;

        this._upButton.updateShow(0,[this._upMoneyNumString,this._addGJNumString]);

        this.oriSkill();

        // 条目显示颜色。普通，未解锁，佛光
        if(this.Talisman.Level < 1){
            let costMoney = this.talisman.UpLVMoney(1);
            this._upMoneyNumString = costMoney.ShowToString;
            let oneAddGJNum = Digit.fromObject(this.talisman.ori.bn).Sub(Digit.fromObject(this.talisman.ori.b)).SetUpNum(1).ShowToString;
            this._addGJNumString = "+" + oneAddGJNum;
            this.changeState("huidu");
        }
        else{
            this.changeState("normal");
        }
    }

    /**
     * 点击升级响应
     */
    private _OnUpLevelClick(event : TouchEvent){

        if(FacadeApp.read(CommandList.Re_Status).TestMoney(this.talisman.UpLVMoney(TalismanWindow.curUpLevel),true)){
            FacadeApp.fetchData(
                [CommandList.M_NET_TalismanNum, "&oper=2", "&id=", this.talisman.ID, "&pm=" + TalismanWindow.curUpLevel], [data => {
                if (data["code"] == FacadeApp.SuccessCode){
                    SoundManager.PlayLvupMusic();
                    this._ifShenjiAni = true;
                    
                    let dg1 = Digit.fromObject(data['data']['power']);
                    let dg2 = Digit.fromObject(FacadeApp.read(CommandList.Re_Status).power);
                    let powerChanged:string = dg1.Sub(dg2).ShowToString;
                    // this.creatAni(powerChanged); // 显示战斗力变化数值

                    this._curSkillNum = this.Talisman.Level;
                    FacadeApp.dispatchAction(CommandList.M_DAT_TalismanList, data['data']);
                    FacadeApp.dispatchAction(CommandList.M_DAT_Change_Money, data['data']['money']);
                    FacadeApp.dispatchAction(CommandList.M_AT_STATUS_Power, data['data']['power']);
                    FacadeApp.dispatchAction(CommandList.M_DAT_Status_PowerClick, data['data']['powerClick']);
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

        this._talismanSkillArr = [this._skill1,this._skill2,this._skill3];

        this.judgeLevelSkill();

        if(this._ifShenjiAni){
            // console.log("升级");
            var las = this.Talisman.Level - this._curSkillNum;

            // 升级动画判断
            if(this._curSkillNum>=10){
                if(las >= 25 || this._curSkillNum % 25 + las >= 25){
                    this._scroller.viewport.scrollH = 0;
                    this.creatSkillAni();
                }
            }
            else{
                if(las>=10 || this._curSkillNum%25+las>=10){
                    this._scroller.viewport.scrollH = 0;
                    this.creatSkillAni();
                }
            }
            this._ifShenjiAni = false;
            this._curSkillNum = this.Talisman.Level;
        }
        else{
            if(this.talisman.Level>=25)
                this._scroller.viewport.scrollH = 70;
            else
                this._scroller.viewport.scrollH = 0;
        }

    }

    /**
     * 技能判断显示
     */
    public judgeLevelSkill(){
        
        var _skillLevelSet:number[] = [11,26,50,75,100,125,150,175,200,1000];

        var _lastThousand:number = this.talisman.Level - this.talisman.Level % 1000;
        var _lastHundred:number = this.talisman.Level - this.talisman.Level % 25;

        for(var i:number=0; i<_skillLevelSet.length; i++){
            if(this.talisman.Level<_skillLevelSet[i]){
                if(i==0){
                    this._talismanSkillArr[0].updataTalismanShow(_skillLevelSet[i]-1,this.Talisman._skillIDSet[i],this.Talisman);
                    this._talismanSkillArr[1].updataTalismanShow(_skillLevelSet[i+1]-1,this.Talisman._skillIDSet[i+1],this.Talisman);
                    this._talismanSkillArr[2].updataTalismanShow(_skillLevelSet[i+2],this.Talisman._skillIDSet[i+2],this.Talisman);
                }
                else if(i==1)
                {
                    this._talismanSkillArr[0].updataTalismanShow(_skillLevelSet[i-1]-1,this.Talisman._skillIDSet[i-1],this.Talisman);
                    this._talismanSkillArr[1].updataTalismanShow(_skillLevelSet[i]-1,this.Talisman._skillIDSet[i],this.Talisman);
                    this._talismanSkillArr[2].updataTalismanShow(_skillLevelSet[i+1],this.Talisman._skillIDSet[i+1],this.Talisman);
                }
                else if(i!=0 && i!=1 && i<=8){
                    this._talismanSkillArr[0].updataTalismanShow(_skillLevelSet[i-2],this.Talisman._skillIDSet[i-2],this.Talisman);
                    this._talismanSkillArr[1].updataTalismanShow(_skillLevelSet[i-1],this.Talisman._skillIDSet[i-1],this.Talisman);

                    if(this.talisman.Level % 1000 + 25 < 1000)
                        this._talismanSkillArr[2].updataTalismanShow(_lastHundred+25,this.Talisman._skillIDSet[8],this.Talisman);
                    else
                        this._talismanSkillArr[2].updataTalismanShow(_lastHundred+25,this.Talisman._skillIDSet[9],this.Talisman);
                }
                else{
                    this._talismanSkillArr[0].updataTalismanShow(_lastHundred-25,this.Talisman._skillIDSet[8],this.Talisman);
                    this._talismanSkillArr[1].updataTalismanShow(_lastHundred,this.Talisman._skillIDSet[8],this.Talisman);

                    if(this.talisman.Level % 1000 + 25 < 1000)
                        this._talismanSkillArr[2].updataTalismanShow(_lastHundred+25,this.Talisman._skillIDSet[8],this.Talisman);
                    else
                        this._talismanSkillArr[2].updataTalismanShow(_lastHundred+25,this.Talisman._skillIDSet[9],this.Talisman);
                }
                break;
            }
            else{
                if(this.talisman.Level % 1000 < 25){
                    this._talismanSkillArr[0].updataTalismanShow(_lastThousand-25,this.Talisman._skillIDSet[8],this.Talisman);
                    this._talismanSkillArr[1].updataTalismanShow(_lastThousand,this.Talisman._skillIDSet[9],this.Talisman);
                    this._talismanSkillArr[2].updataTalismanShow(_lastThousand+25,this.Talisman._skillIDSet[8],this.Talisman);
                }
                else{
                    this._talismanSkillArr[0].updataTalismanShow(_lastHundred-25,this.Talisman._skillIDSet[8],this.Talisman);
                    this._talismanSkillArr[1].updataTalismanShow(_lastHundred,this.Talisman._skillIDSet[8],this.Talisman);

                    if(this.talisman.Level % 1000 + 25 < 1000)
                        this._talismanSkillArr[2].updataTalismanShow(_lastHundred+25,this.Talisman._skillIDSet[8],this.Talisman);
                    else
                        this._talismanSkillArr[2].updataTalismanShow(_lastHundred+25,this.Talisman._skillIDSet[9],this.Talisman);
                }
            }
        }
    }

    /**
     * 创建技能升级动画
     */
    private creatSkillAni(){
        var talisman:any=[this._skill1,this._skill2,this._skill3];

        MovieManage.GetDragonBonesMovie("shengji_tx",arm =>{
            var _armture : dragonBones.Armature = arm;
            this._group.addChild(_armture.display);
            
            if(this.Talisman.Level>=25){
                _armture.display.x = talisman[1].x + talisman[1].width/2;
                _armture.display.y = talisman[1].y + talisman[1].height/2;

                egret.Tween.removeTweens(this._scroller.viewport);
                this._scroller.viewport.scrollH = 0;
                egret.Tween.get(this._scroller.viewport).to({scrollH:70},1000);
            }
            else{
                _armture.display.x = talisman[0].x + talisman[0].width/2;
                _armture.display.y = talisman[0].y + talisman[0].height/2;
            }

                _armture.addEventListener(dragonBones.AnimationEvent.COMPLETE, function(){
                    this._group.removeChild(_armture.display);
                },this);
                _armture.animation.gotoAndPlay("shengji_tx");
        },this);
    }

    /**
     * 创建升级战力文字动画效果
     */
    private creatAni($num){   
        var label:eui.BitmapLabel = new eui.BitmapLabel();
        label.font = "upZLNum_fnt"; //todo：请统一字体文件，有很多都没有“e”这个字母，例如这个wz.fnt
        
        label.text = $num;
        this.addChild(label);

        label.y = this.height/2;
        label.x = this.width/2;

        egret.Tween.get(label).to({y:0,alpha:0},2000).call(function(){this.removeChild(label)}.bind(this));
    }

    /**
     * 取得显示物品
     */
    public get Talisman(): Talisman{
        return this.talisman;
    }

    /**
     * 图标点击响应
     */
    private _OnImageClick(event: egret.TouchEvent){
        FacadeApp.Notify(CommandList.M_CMD_ShowTalisman, this.talisman);
    }


    /**
     * 更改状态，灰度，高亮，正常
     */
    public changeState($state){
        if($state == "huidu"){
            this._bgIma.setHuiduState();
            this._iconIma.filters = [FilterManage.HuiDu];
            // this._upButton.setEnabled(false);
            // this._upButton.setDisabled();

            // 高亮代表有佛光,灰度与正常没有佛光
            this._fgStarIma.visible = false;
        }
        else if($state == "gaoliang"){
            this._bgIma.setGaoLiangState();
            this._iconIma.filters = null;
            // this._upButton.setEnabled(true);
            // this._upButton.setNormal();

            // 高亮代表有佛光,灰度与正常没有佛光
            this._fgStarIma.visible = true;

        }
        else if($state == "normal"){
            this._bgIma.setNormalState();
            this._iconIma.filters = null;
            // this._upButton.setEnabled(true);
            // this._upButton.setNormal();

            //  高亮代表有佛光,灰度与正常没有佛光
            this._fgStarIma.visible = false;
        }
    }

    //  变量
    private _fgStarIma: eui.Image;              // 佛光标志
    private _bgIma: ListBgImage;                // 可更换背景
    private _iconIma : eui.Image;               // 法宝图标
    private _nameIma : eui.Image;               // 物品名字
    private _levelLabel: eui.Label;             // 等级
    private _gjLabel: eui.Label;                // 攻击力

    private _upButton: LabelButton;               // 升级按钮

    private _upMoneyNumString : String;          // 升级金币
    private _addGJNumString : String;            // 增加攻击力

    private talisman: Talisman;

    private _group : eui.Group;                 // 容器

    private _scroller : eui.Scroller            // 技能列表
    private _skill1 : SkillLine;             // 技能1
    private _skill2 : SkillLine;             // 技能2
    private _skill3 : SkillLine;             // 技能3

    private _talismanSkillArr: SkillLine[] = [];                // 技能组

    private _curSkillNum:number = -1;            // 当前技能等级

    private _ifShenjiAni: boolean = false;      // 是否升级

}