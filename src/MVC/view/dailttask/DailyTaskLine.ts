/**
 * 每日任务条目
 */
class DailyTaskLine extends eui.Component implements IGroupLine{

    /**
     * 构造方法
     */
    public constructor() {
        super();
        this.skinName = "resource/game_skins/ui/TaskList.exml"; //加载控件皮肤
    }

    //IGroupLine接口函数
    /**
     * 返回标志ID
     */
    public get getId():number{
        return this._task ? this._task.ID : -1;
    }
    /**
     * 更新面板内容 item 关联的数据项
     */
    public update(task: any): DailyTaskLine{
        this._task = TaskManager.fromData(task);
        this.Render();
        return this;
    }

    /**
     * 子项创建完成
     */
    protected createChildren() {
        super.createChildren();
        this._awardButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnButtonClick, this);//添加按钮点击事件
        this._consAwaButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnConsAwaClick, this);//添加按钮点击事件
        this._isCreat = true;

        this.Render();
    }

    public Render(){
        if(this._task == null) return;
        if(!this._isCreat) return;
        
        // let ci = ConfigStaticManager.getItem(ConfigTypeName.Task, this.getId);
        // if(typeof ci == 'undefined' || ci == null){return;}

        this._nameLabel.text = this._task.Name;
        this._desLabel.text =  this._task.Description;
        this._iconImage.source = this._task.IconRes;    //图标资源尚未规划
        this._awardLabel.text = this._task.Bonus;
        //需要一个参数判断是否完成 测试：参数 type
        if(this._task.ori.status == 1 ) {   //任务已完成，未领奖
            this._consAwaButton.visible = false;
            this._awardButton.visible = true;
        }
        else if(this._task.ori.status == 0){//任务未完成
            this._consAwaButton.visible = true;
            this._awardButton.visible = false;
        }

        let conList = this._task.ori.conditionMgr.conList;
        Object.keys(conList).map(cid => {
            let co = conList[cid];
            this._timesLabel.text = co.value + '/' + co.threshold;
        });
    }

    /**
     * 领奖按钮点击响应
     */
    private _OnButtonClick(event: egret.TouchEvent){
        SoundManager.PlayButtonMusic();
        FacadeApp.fetchData([CommandList.M_NET_TASK, '&oper=1&id=' + this.getId], [data =>{
            if (data["code"] == FacadeApp.SuccessCode){
                FacadeApp.dispatchAction(CommandList.TASK_GET_LIST, data['data']['items']);
                FacadeApp.fetchData([CommandList.M_NET_STATUS], [data=>{
                    FacadeApp.dispatchAction(CommandList.M_AT_STATUSLIST, data['data']);
                }]);
            }
            else{
                UIPage.inst(UIPage).ShowPrompt().ShowWindow(FacadeApp._errorCodeSet[data["code"]]);
            }
        }]);
    }
    /**
     * 花费钻石领奖按钮点击响应
     */
    private _OnConsAwaClick(event: egret.TouchEvent){
        SoundManager.PlayButtonMusic();
        FacadeApp.fetchData([CommandList.M_NET_TASK, '&oper=2&id=' + this.getId], [data=>{
            if (data["code"] == FacadeApp.SuccessCode){
                FacadeApp.dispatchAction(CommandList.TASK_GET_LIST, data['data']['items']);
                FacadeApp.fetchData([CommandList.M_NET_STATUS], [data=>{
                    FacadeApp.dispatchAction(CommandList.M_AT_STATUSLIST, data['data']);
                    if(data["code"] !=FacadeApp.SuccessCode) UIPage.inst(UIPage).ShowPrompt().ShowWindow(FacadeApp._errorCodeSet[data["code"]]);
                }]);
            }
            else{
                UIPage.inst(UIPage).ShowPrompt().ShowWindow(FacadeApp._errorCodeSet[data["code"]]);
                // FacadeApp.ShowError(data["code"]);
            }
        }]);
    }

    

    /**
     * 设置文本文字效果
     */
    private _SetFilter(){
        // this._nameLabel.filters = [FilterManage.AddMiaoBian(2,0xffffff)];
        // this._timesLabel.filters = [FilterManage.AddMiaoBian(2,0xffffff)];
    }

    //  变量
    public _iconImage: eui.Image;                  // 图片
    public _awardButton: eui.Button;               // 领奖按钮
    public _nameLabel: eui.Label;                  // 任务名字文本
    public _desLabel: eui.Label;                   // 描述文本
    public _awardLabel: eui.Label;                 // 奖励文本
    public _timesLabel: eui.Label;                 // 次数文本
    public _consAwaButton: eui.Button;             // 花费钻石领奖
    public _task: Task = null;                       //任务
    private _isCreat: boolean = false;          // 是否创建完成
}