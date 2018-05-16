/**
 * 和DailyTaskWindow对应的Mediator
 */
class DailyTaskWindowMediator extends puremvc.Mediator implements puremvc.IMediator {
    /**
     * 和指定UI建立关联，为UI上的控件订阅界面事件，并提供对应的响应函数
     */
    public constructor(viewComponent: any) {
        super(ViewerName.DailyTaskWindowMediator, viewComponent);

        //注册数据源，所有在此注册的数据源一旦发生变化，就会自动调用界面单元的Render函数
        this.page.RegisterDataSource([CommandList.TASK_GET_LIST]);
    }

    /**
     * 在这里书写所有需要订阅的消息，所有在这里登记的消息会被自动捕获，并交由handleNotification处理
     */
    public listNotificationInterests(): Array<any> {
        return [CommandList.M_CMD_UiOpened_Task];
    }

    /**
     * 在这里处理所有订阅的消息
     */
    public handleNotification(notification: puremvc.INotification): void {
        switch (notification.getName()) {
            case CommandList.M_CMD_UiOpened_Task:
                FacadeApp.fetchData([CommandList.M_NET_TASK, "&oper=0"], [data=>{
                    //将网络数据保存到数据仓库，自动触发数据更新，调用界面单元的Render函数进行刷新
                    FacadeApp.dispatchAction(CommandList.TASK_GET_LIST, data['data']['items']);
                    if(data["code"] !=FacadeApp.SuccessCode) UIPage.inst(UIPage).ShowPrompt().ShowWindow(FacadeApp._errorCodeSet[data["code"]]);
                }]);
                break;
        }
    }

    /**
     * 返回关联的界面单元
     */
    public get page(): DailyTaskWindow {
        return <DailyTaskWindow><any>(this.viewComponent);
    }
}
