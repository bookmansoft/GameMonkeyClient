/**
 * 和舞台（Main）对应的Mediator
 */
class MainMediator extends puremvc.Mediator implements puremvc.IMediator {
    /**
     * 和指定UI建立关联，为UI上的控件订阅界面事件，并提供对应的响应函数
     */
    public constructor(viewComponent: any) {
        super(ViewerName.MainMediator, viewComponent);
    }

    /**
     * 在这里书写所有需要订阅的消息
     */
    public listNotificationInterests(): Array<any> {
        return [CommandList.M_CMD_Login];
    }

    /**
     * 在这里处理所有订阅的消息
     */
    public handleNotification(notification: puremvc.INotification): void {
        switch (notification.getName()) {
            case CommandList.M_CMD_Login: //登录游戏，发送副本状态同步消息
                FacadeApp.fetchData([CommandList.M_NET_CheckpointNum, "&oper=4"], [data=>{
                    FacadeApp.dispatchAction(CommandList.M_AT_SyncCheckpoint, data['data']);
                    if (data["code"] == FacadeApp.SuccessCode){
                        // GameConfigOfRuntime.serverTime = 0;
                        FacadeApp.Notify(CommandList.M_CMD_CHANGE, 1); //推动游戏进程，1是初始化各个信息
                        //SoundManager.PlayBackgroundMusic(); //报错，暂时屏蔽 2016-12-21
                    }else{
                        UIPage.inst(UIPage).ShowPrompt().ShowWindow(FacadeApp._errorCodeSet[data["code"]]);
                    }
                }, e=>{
            		FacadeApp.Notify(CommandList.M_CMD_Login);
                }]);
                break;
        }
    }

    /**
     * 返回关联的UI单元
     */
    public get main(): Main {
        return <Main><any>(this.viewComponent);
    }
}
