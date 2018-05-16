/**
 * 宠物行
 */
class PetLine extends eui.Component{
    /**
     * 构造方法
     */
    public constructor() {
        super();
        this.skinName = "resource/game_skins/pet/PetListSkins.exml";
    }

    //实现接口
    // public get getId():number{
    //     return this.Pet ? this.Pet.ID : -1;
    // };

    /**
     * 更新
     */
    public update(pet:any):PetLine{
        this._pet = PetManager.fromData(pet);
        this.Render();
        return this;
    }

    /**
     * 子项创建完成
     */
    protected createChildren() {
        super.createChildren();
        this._battleButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBattleClick, this);
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

        this._battleButton.visible = this.Pet.IsGet;
        this._battleButton.enabled = !this.Pet.IsFighting;
        this._unLockLabel.visible = !this.Pet.IsGet;

        this._gjcsLabel.text = this.Pet.AutoTimes.toString() + "次";
    }

    /**
     * 点击切换宠物
     */
    private _OnBattleClick(event : TouchEvent){
        if (!this.Pet.IsGet) 
            return;

        //发送网络报文以获取远程数据
        FacadeApp.fetchData([CommandList.M_NET_PetNum, "&oper=3&pm=0&id=" + this.Pet.ID], [data=>{
            //收到远程数据，将其保存到数据仓库，同时触发数据源事件，引发界面单元Render
            FacadeApp.dispatchAction(CommandList.M_DAT_PetList, data['data']);
            FacadeApp.dispatchAction(CommandList.M_CMD_Change_Pet);
            
            if(data["code"] != FacadeApp.SuccessCode) {
                UIPage.inst(UIPage).ShowPrompt().ShowWindow(FacadeApp._errorCodeSet[data["code"]]);
                return;
            }
            FacadeApp.fetchData([CommandList.M_NET_SkillNum, "&oper=1&aid=1&pm=1"], [data => {
                FacadeApp.dispatchAction(CommandList.M_AT_EFFECTS, data['data']['effects']);//更新效果列表
            }]);
        }]);
    }

    /**
     * 取得显示宠物
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

    /**
     * 更改状态，灰度，高亮，正常
     */
    // public changeState($state){
    //     if($state == "huidu"){
    //         this._bgIma.setHuiduState();
    //         this._petImage.filters = [FilterManage.HuiDu];
    //         this._battleButton.enabled = false;
    //         this._battleButton.filters = [FilterManage.HuiDu];
    //     }
    //     else if($state == "gaoliang"){
    //         this._bgIma.setGaoLiangState();
    //         this._petImage.filters = null;
    //         this._battleButton.enabled = true;
    //         this._battleButton.filters = null;

    //     }
    //     else if($state == "normal"){
    //         this._bgIma.setNormalState();
    //         this._petImage.filters = null;
    //         this._battleButton.enabled = true;
    //         this._battleButton.filters = null;
    //     }
    // }


    //  变量
    private _bgIma: ListBgImage;                // 可更换背景
    private _petImage : eui.Image;              // 物品图标
    private _nameIma : eui.Image;               // 宠物名字图片
    private _battleButton: eui.Button;          // 出战按钮
    private _msLabel : eui.Label;               // 增加攻击力
    private _gjcsLabel : eui.Label;             // 增加攻击力
    private _pet: Pet;                          // 显示的物品

    // private _changeButton: eui.Button;          // 更换按钮
    private _isCreat: boolean = false;          // 是否创建完成
    private _unLockLabel: eui.Label;            // 未获得文本
}