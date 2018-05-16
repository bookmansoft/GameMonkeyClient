/**
 * 和舞台对应的Mediator
 */
class MarshallingWindowMediator extends puremvc.Mediator implements puremvc.IMediator {
    /**
     * 和指定UI建立关联，为UI上的控件订阅界面事件，并提供对应的响应函数
     */
    public constructor(viewComponent: any) {
        super(ViewerName.MarshallingWindowMediator, viewComponent);
        this.RegisterDataSourceFun();
    }

    /**
     * 订阅数据事件
     */
    private RegisterDataSourceFun(){
        this.page.RegisterDataSource([
            CommandList.M_DAT_CardList,
            CommandList.M_DAT_MarshallingList,
        ]);
    }

    /**
     * 在这里书写所有需要订阅的消息
     */
    public listNotificationInterests(): Array<any> {
        return [
            CommandList.M_CMD_UiOpened_Marshalling,
            CommandList.M_CMD_Change_Marshalling,
        ];
    }

    /**
     * 在这里处理所有订阅的消息
     */
    public handleNotification(notification: puremvc.INotification): void {
        switch (notification.getName()) {
            case CommandList.M_CMD_UiOpened_Marshalling:
            case CommandList.M_CMD_Change_Marshalling:
                // 查询所有分组列表
                FacadeApp.fetchData([CommandList.M_NET_Card, "&oper=9"], [data => {
                    //将网络数据保存到数据仓库，自动触发数据更新
                    FacadeApp.dispatchAction(CommandList.M_DAT_MarshallingList, data['data']);
                    if(data["code"] !=FacadeApp.SuccessCode) UIPage.inst(UIPage).ShowPrompt().ShowWindow(FacadeApp._errorCodeSet[data["code"]]);
                }]);
                FacadeApp.fetchData([CommandList.M_NET_Card, "&oper=1"], [data => {
                    //将网络数据保存到数据仓库，自动触发数据更新
                    FacadeApp.dispatchAction(CommandList.M_DAT_MarshallingList, data['data']);
                    if(data["code"] !=FacadeApp.SuccessCode) UIPage.inst(UIPage).ShowPrompt().ShowWindow(FacadeApp._errorCodeSet[data["code"]]);
                }]);
                break;
        }
    }

    /**
     * 返回关联的UI单元
     */
    public get page(): MarshallingWindow {
        return <MarshallingWindow><any>(this.viewComponent);
    }
}
