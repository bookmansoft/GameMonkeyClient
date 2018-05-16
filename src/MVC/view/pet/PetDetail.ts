/**
 * 宠物详细信息界面
 */
class PetDetail extends APanel{
    /**
     * 构造方法
     */
    public constructor() {
        super("resource/game_skins/pet/PetDetailSkins.exml");
    }

    /**
     * 素材加载完毕时自动调用
     */
    public ComponentWillMount(){
        this._closeButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnCloseClick, this);
        this._leftButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnLeftClick, this);
        this._rightButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnRightClick, this);
        this._knowButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnKnowClick, this);
        // this._upButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnUpClick, this);
        // this._expBar.value = 1;

        this.RegisterDataSourceFunction();
    }

    /**
     * 被添加到舞台时自动调用
     * 注：目前的机制并不能保证ComponentWillMount先于ComponentDidMount被调用
     */
    public ComponentDidMount(){
    }

    /**
     * 订阅和数据仓库相关的事件，当数据更新时自动刷新界面
     */
    public RegisterDataSourceFunction(){
        this.RegisterDataSource([
            CommandList.M_DAT_PetList,
        ]); 
    }

    /**
     * 刷新
     */
    public async Render(){
        this.ShowPet(this._pet);
    }

    /**
     * 关闭按钮响应
     */
    private _OnCloseClick(event: egret.TouchEvent){
        SoundManager.PlayCloseWinMusic();
        this.UnRegister();
    }

    /**
     * 向左按钮响应
     */
    private _OnLeftClick(event: egret.TouchEvent){
        var pet: Pet = PetManager.GetPetByID(this._pet.ID - 1);// FacadeApp.read(CommandList.Re_PetInfo).GetPetByID(this._pet.ID - 1);
        if (pet != null){
            this.ShowPet(pet);
        }
        else{
            console.log("宠物为空" + this._pet.ID);
        }
    }

    /**
     * 向右按钮响应
     */
    private _OnRightClick(event: egret.TouchEvent){
        var pet: Pet = PetManager.GetPetByID(this._pet.ID + 1);//FacadeApp.read(CommandList.Re_PetInfo).GetPetByID(this._pet.ID + 1);
        if (pet != null){
            this.ShowPet(pet);
        }
        else{
            console.log("宠物为空" + this._pet.ID);
        }
    }

    /**
     * '知道了'按钮响应事件
     */
    private _OnKnowClick(event: egret.TouchEvent){
        this._OnCloseClick(null);
    }

    /**
     * 升级点击
     */
    // private _OnUpClick(event: egret.TouchEvent){
    //     FacadeApp.fetchData([CommandList.M_NET_PetNum, "&oper=2&pm=1&id="+this._pet.ID], [data=>{
    //         //4、收到远程数据，将其保存到数据仓库，同时触发数据源事件，引发界面单元Render
    //         FacadeApp.dispatchAction(CommandList.M_DAT_PetList, data['data']);
    //         FacadeApp.dispatchAction(CommandList.M_DAT_Status_PowerClick, data['data']['powerClick']);
    //         if(data["code"] != FacadeApp.SuccessCode) UIPage.inst(UIPage).ShowPrompt().ShowWindow("失败！，错误代码" + data["code"]);
    //     }]);
    // }

    /**
     * 显示宠物
     */
    public ShowPet(pet: Pet){
        if (pet == null) return;

        this._pet = pet;
        RES.getResAsync(pet.QSRes,icon =>{ this._petImage.texture = icon},this);
        RES.getResAsync(pet.NameRes,icon =>{ this._nameIma.texture = icon},this);
        // this._desLabel.text = pet.Description;
        this._levelLabel.text = "Lv." + FacadeApp.read(CommandList.Re_PetInfo).PetLevel.toString();
        if(!this._pet.IsGet) this._levelLabel.text = "Lv.0";
        
        this._battleImage.visible = pet.IsFighting;
        this._UpdateButton();

        // 除了紫金钵其他都是购买的
        if(this._pet.ID == 1){
            this._petGetTypeLabel.text = "初始赠送";
        }else{
            this._petGetTypeLabel.text = "商店购买";
        }

        
        /**
         * 更新天赋
         */
        let geniusHeight = 0;
        for(let i = 0; i< this._pet.Genius.length + 1; i++){
            if(!this._geniusSet[i]){
                let geniusLine = new PetGeniusLine();
                this._geniusGroup.addChild(geniusLine);
                this._geniusSet.push(geniusLine);
            }

            if(i == 0){
                this._geniusSet[i].upDataShow(0,this._pet.Description);
            }else{
                this._geniusSet[i].upDataShow(parseInt(this._pet.Genius[i-1]));
            }

            this._geniusSet[i].y = geniusHeight;
            geniusHeight += this._geniusSet[i].height + 15;
        }

        /**
         * 移除。因为在前面有个详情，所以长度应该减1
         */
        if(this._pet.Genius.length < this._geniusSet.length - 1){
            let deleLength = this._geniusSet.length - 1 - this._pet.Genius.length;
            for(let i=0; i<deleLength; i++){
                this._geniusGroup.removeChild(this._geniusSet[this._geniusSet.length - 1]);
                this._geniusSet.splice(this._geniusSet.length - 1,1);
            }
        }
    }

    /**
     * 更新按钮显示
     */
    private _UpdateButton(){
        var id: number = this._pet.ID;
        this._leftButton.visible = id > 1? true : false;
        this._rightButton.visible = id < 7? true : false;
    }

    // 变量
    private _closeButton: eui.Button;                           // 关闭按钮
    private _leftButton: eui.Button;                            // 向左按钮
    private _rightButton: eui.Button;                           // 向右按钮
    private _battleImage: eui.Image;                            // 出战图片

    // private _expBar: eui.ProgressBar;                           // 经验进度条
    private _knowButton: eui.Button;                            // 知道按钮
    // private _upButton: eui.Button;                              // 升级按钮
    private _nameIma: eui.Image;                                // 名字图片
    private _levelLabel: eui.Label;                             // 等级文本
    // private _desLabel: eui.Label;                               // 描述文本
    private _petImage: eui.Image;                               // 宠物图片

    private _pet: Pet;                                          // 当前显示宠物

    private _petGetTypeLabel: eui.Label;                        // 宠物获得方式
    private _geniusScroller: eui.Scroller;                      // 天赋滚动区域
    private _geniusGroup: eui.Group;                            // 天赋显示区域
    private _geniusSet: PetGeniusLine[] = [];                   // 宠物天赋
}