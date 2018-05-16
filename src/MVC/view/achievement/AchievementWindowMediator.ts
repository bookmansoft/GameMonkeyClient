/**
 * 和舞台对应的Mediator
 */
class AchievementWindowMediator extends puremvc.Mediator implements puremvc.IMediator {
    /**
     * 和指定UI建立关联，为UI上的控件订阅界面事件，并提供对应的响应函数
     */
    public constructor(viewComponent: any) {
        super(ViewerName.AchievementWindowMediator, viewComponent);

        this.page.RegisterDataSource([CommandList.TASK_GET_LIST]);
    }

    /**
     * 在这里书写所有需要订阅的消息
     */
    public listNotificationInterests(): Array<any> {
        return [CommandList.M_CMD_UiOpened_Achievement];
    }

    /**
     * 在这里处理所有订阅的消息
     */
    public handleNotification(notification: puremvc.INotification): void {
        switch (notification.getName()) {
            case CommandList.M_CMD_UiOpened_Achievement:
                //3、收到界面事件，发送网络报文以获取远程数据
                FacadeApp.fetchData([CommandList.M_NET_TASK, "&oper=0"], [data=>{
                    //将网络数据保存到数据仓库，自动触发数据更新，调用界面单元的Render函数进行刷新
                    FacadeApp.dispatchAction(CommandList.TASK_GET_LIST, data['data']['items']);
                    if(data["code"] == FacadeApp.SuccessCode){

                    }else{
                        UIPage.inst(UIPage).ShowPrompt().ShowWindow(FacadeApp._errorCodeSet[data["code"]]);
                    }
                }]);
                break;
        }
    }

    /**
     * 返回关联的UI单元
     */
    public get page(): AchievementWindow {
        return <AchievementWindow><any>(this.viewComponent);
    }
}