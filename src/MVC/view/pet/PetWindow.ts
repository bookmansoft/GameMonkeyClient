/**
 * 宠物界面单元
 * 1、注册界面介质，在界面介质中登记所关注的数据源
 * 2、实现ComponentWillMount、ComponentDidMount、Render三个核心函数
 * 
 * 实现如下功能：
 * 1、列表 OK
 * 2、激活 OK 
 * 3、切换 OK
 * 4、升级 缺乏界面元素
 * 5、进阶 缺乏界面元素
 */
class PetWindow extends APanel{
    public constructor() {
        super("resource/game_skins/pet/PetWindowSkins.exml");

        //  动画面板需要设置的环境变量
        // super.InitComponent(
        //     this._petGroup,    // 设置列表容器
        //     this._petList,     // 设置列表滚动控制器
        //     // 设置数据条目类工厂
        //     [
        //         function():PetCurOutLine { return PetWindow.genericsFactory(PetCurOutLine); },
        //         function():PetLine { return PetWindow.genericsFactory(PetLine); }
        //     ],
        //     // 获取需要列表显示的数据内容
        //     [
        //         function(){
        //             let fightPet = FacadeApp.read(CommandList.Re_PetInfo).FightingPetInfo;
        //             let indexList = ["99999"];
        //             this._listLength = 1;
        //             return [fightPet, indexList];    // 出战宠物信息，出战宠物id
        //         },
        //         function(){
        //             let otherPet = FacadeApp.read(CommandList.Re_PetInfo).list;
        //             let state = FacadeApp.read(CommandList.Re_PetInfo);

        //             let indexList = Object.keys(otherPet).filter(id=>{
        //                 if(otherPet[id].i == state.active){
        //                     return false;
        //                 }
        //                 return true;
        //             });

        //             this._listLength += indexList.length;

        //             return [otherPet, indexList];
        //         }
        //     ]
        // );

        //注册界面介质，为避免重复注册，先移除同名介质
        FacadeApp.inst.removeMediator(ViewerName.PetWindowMediator);
        FacadeApp.inst.registerMediator(new PetWindowMediator(this));
    }

    /**
     * 素材加载完毕时自动调用
     */
    public ComponentWillMount(){
        this._totalGJLabel.rotation = 8;
        this._petList.height = 250;
        this._upLevelLabel.touchEnabled = false;
        this.y = GameConfigOfRuntime.gameHeight;
		this._closeButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnCloseClick, this);
		this._upOrDownButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._UpOrDownPanel, this);
        this._upLevelButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._UpLevelClick, this);
    }

    /**
     * 被添加到舞台时自动调用
     * 注：目前的机制并不能保证ComponentWillMount先于ComponentDidMount被调用
     */
    public ComponentDidMount(){
        // this.firstOpen = true;
        // 发出界面已打开事件，界面介质需要事先登记该事件，并在事件发生时进行响应
        FacadeApp.Notify(CommandList.M_CMD_UiOpened_Pet);
    }

    /**
     * 界面介质登记的数据源发生变化时调用
     */
    public async Render(){
        super.Render();


        // 获取其他宠物
        let allPetInfo = FacadeApp.read(CommandList.Re_PetInfo).list;
        let indexList = Object.keys(allPetInfo).filter(id=>{
            if(allPetInfo[id].i == FacadeApp.read(CommandList.Re_PetInfo).active){
                return false;
            }
            return true;
        });

        // 更新创建宠物
        for(let i=0; i<indexList.length + 1; i++){
            if(!this._lineSet[i]){
                let line = null;
                if(i==0){ line = new PetCurOutLine(); }
                else{ line = new PetLine(); }
                this._petGroup.addChild(line);
                this._lineSet[i] = line; 
                this._lineSet[i].y = i * line.height;
            }

            if(i == 0) this._lineSet[i].update(FacadeApp.read(CommandList.Re_PetInfo).FightingPetInfo);
            else this._lineSet[i].update(allPetInfo[indexList[i-1]]);
        }

        // 转生条位置
        this._zsLine.y = this._lineSet.length * 125;

        // if(this._petList.viewport.contentHeight == 0 || this._petList.viewport.contentHeight == this._zsLine.height){
            // this._zsLine.y = this._lineSet.length * 125;
        // }
        // else{
        //     this._zsLine.y = this._petList.viewport.contentHeight - this._zsLine.height;
        // }

        //显示总战力
        this._totalGJLabel.text = Digit.fromObject(FacadeApp.read(CommandList.Re_Status).powerClick).ShowToString;

    }

    /**
     * 升几级按钮响应
     */
    private _UpLevelClick(event : egret.TouchEvent){
        this._curUpLevelNum +=1;

        if(this._curUpLevelNum == 1){
            this._upLevelLabel.text = "X1";
            PetWindow.curUpLevel = 1;
        }
        else if(this._curUpLevelNum == 2){
            this._upLevelLabel.text = "X25";
            PetWindow.curUpLevel = 25;
        }
        else if(this._curUpLevelNum == 3){
            this._upLevelLabel.text = "X100";
            PetWindow.curUpLevel = 100;
        }
        else if(this._curUpLevelNum == 4){
            this._upLevelLabel.text = "X1000";
            PetWindow.curUpLevel = 1000;
        }
        else if(this._curUpLevelNum == 5){
            this._curUpLevelNum = 1;
            this._upLevelLabel.text = "X1";
            PetWindow.curUpLevel = 1;
        }

        this.Render();
    }

    /**
     * 关闭按钮响应
     */
    private _OnCloseClick(event : egret.TouchEvent){
		this.CloseWindow();
    }

	/**
	 * 上或下面板
	 */
	private _UpOrDownPanel(): void {
        SoundManager.PlayButtonMusic();
        super._UpOrDown(this._upOrDownButton.selected, this._petList);
	}

    // 变量
    private _closeButton : eui.Button;                  // 关闭按钮
    public _upOrDownButton : eui.ToggleButton;          // 上下按钮
    private _totalGJLabel : eui.BitmapLabel;            // 总攻击力
    private _petList : eui.Scroller;                    // 物品列表
    private _petGroup : eui.Group;                      // 滚动容器
    private _zsLine: ZSLine;                            // 转生行
    // private _listLength: number = PetManager.PetSet.length - 1;                    // 列表长度

    
    private _upLevelButton : eui.Button;                // 升几级按钮
    private _upLevelLabel : eui.Label;                  // 升几级文本
    private _curUpLevelNum : number = 1;                // 当前升几级
    public static curUpLevel : number = 1;              // 当前升几级

    private _lineSet: any[] = [];                       // 宠物条
    
}