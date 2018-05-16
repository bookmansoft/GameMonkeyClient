/**
 * 成就行
 */
class AchievementLine extends eui.Component implements IGroupLine{
	/*
	* 构造方法
     */
    public constructor(){
        super();
        this.skinName = "resource/game_skins/achievement/AchievementLineSkins.exml";
    }

    //实现接口
    public get getId():number{
        return this._achievement ? this._achievement.ID : -1;
    };

    /**
     * 更新
     */
    public update(task:any):AchievementLine{
        this._achievement = TaskManager.fromData(task);
        this.Render();
        return this;
    }

    /**
     * 子项创建完成
     */
    protected createChildren() {
        super.createChildren();
        this._lingquBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnButtonClick, this);//添加按钮点击事件
        this._isCreat = true;

        this.Render();
    }

    /**
     * 显示物品 
     * @note
     *  当任务条件变化时，没有及时刷新
     */
    public Render(){
        if(!this._isCreat) return;
        
        this._nameLabel.text = this._achievement.Name;
        this._derLabel.text =  this._achievement.Description;
        this._iconIma.source = this._achievement.IconRes;

        //  显示完成任务的条件，目前只显示第一条
        let conList = this._achievement.ori.conditionMgr.conList;
        Object.keys(conList).map(cid => {
            let co = conList[cid];
            this._jinduLabel.text = co.value + '/' + co.threshold;
            this._pregrossIma.width = Math.min((co.value/co.threshold),1) * 316;
        });

        //  显示完成任务的奖励，目前只显示第一条
        if(this._achievement.ori.bonusMgr){
            let bonusList = this._achievement.ori.bonusMgr.bonusList;
            this._addLabel.visible = true;
            Object.keys(bonusList).map(cid => {
                let co = bonusList[cid];
                this._addLabel.text = RewardItemManager.GetRewardItemNameByID[co.type] + ': ' + co.value;
            });
        }
        else{
            this._addLabel.visible = false;
        }

        //显示任务当前的嵌套层次，例如1/3，表示该任务共有3层，目前正在完成第一层
        this._levelLabel.text = this._achievement.ori.layer;
        
        //是否可以领奖 0未完成 1已完成未领奖 2已领奖
        this._lingquBtn.enabled = !(this._achievement.ori.status == 0);
        this._lingquBtn.visible = (this._achievement.ori.status != 2);
    }

    /**
     * 领奖按钮点击响应
     */ 
    private _OnButtonClick(event: egret.TouchEvent){
        SoundManager.PlayButtonMusic();
        FacadeApp.fetchData([CommandList.M_NET_TASK, '&oper=1&id=' + this._achievement.ID], [data=>{
            if(data["code"] == FacadeApp.SuccessCode){
                FacadeApp.fetchData([CommandList.M_NET_TASK, "&oper=0"], [dt=>{
                    //将网络数据保存到数据仓库，自动触发数据更新
                    if(dt["code"] == FacadeApp.SuccessCode){
                        FacadeApp.dispatchAction(CommandList.TASK_GET_LIST, data['data']['items']);  
                        FacadeApp.fetchData([CommandList.M_NET_STATUS], [data=>{
                            FacadeApp.dispatchAction(CommandList.M_AT_STATUSLIST, data['data']);
                        }]);                    
                    }else{
                        UIPage.inst(UIPage).ShowPrompt().ShowWindow(FacadeApp._errorCodeSet[data["code"]]);
                    }
                }]);
            }else{
                UIPage.inst(UIPage).ShowPrompt().ShowWindow(FacadeApp._errorCodeSet[data["code"]]);
            }
            
        }]);
    }

    /**
     * 设置文本文字效果
     */
    private _SetFilter(){
        // this._nameLabel.filters = [FilterManage.AddMiaoBian(2,0xffffff)];
        // this._jinduLabel.filters = [FilterManage.AddMiaoBian(1,0x000000)];
    }

    private _lingquBtn : eui.Button;            // 领奖按钮
    private _iconIma : eui.Image;               // 图标
    private _derLabel : eui.Label;              // 成就描述
    private _nameLabel : eui.Label;             // 成就名称
    private _addLabel : eui.Label;              // 奖励内容
    private _jinduLabel : eui.Label;            // 进度/阈值
    private _levelLabel : eui.Label;            // 嵌套层次
    public _achievement: Task;                          //任务
    private _pregrossIma: eui.Image;            // 进度条
    private _isCreat: boolean = false;          // 是否创建完成
}