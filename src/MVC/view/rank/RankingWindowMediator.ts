/**
 * 和舞台（Main）对应的Mediator
 */
class RankingWindowMediator extends puremvc.Mediator implements puremvc.IMediator {
    /**
     * 和指定UI建立关联，为UI上的控件订阅界面事件，并提供对应的响应函数
     */
    public constructor(viewComponent: any) {
        super(ViewerName.RankingWindowMediator, viewComponent);
        // 更新页面
        this.RegisterDataSourceFun();
    }

    /**
     * 订阅和数据仓库相关的事件，当数据更新时自动刷新界面
     */
    public RegisterDataSourceFun(){
        this.page.RegisterDataSource([
            CommandList.RANK_GET_LIST1,
            CommandList.RANK_GET_LIST2,
            CommandList.RANK_GET_LIST3,
        ]); 
    }

    /**
     * 在这里书写所有需要订阅的消息
     */
    public listNotificationInterests(): Array<any> {
        return [
            CommandList.M_CMD_UIOPENED_RANK_Tab1, 
            CommandList.M_CMD_UIOPENED_RANK_Tab2,
            CommandList.M_CMD_UIOPENED_RANK_Tab3,
        ];
    }

    /**
     * 在这里处理所有订阅的消息
     */
    public handleNotification(notification: puremvc.INotification): void {
        switch (notification.getName()) {
            case CommandList.M_CMD_UIOPENED_RANK_Tab1:
                this.page._pageNum = 0;
                FacadeApp.fetchData([CommandList.M_NET_RankNum, "&oper=1"], [data=>{
                    // console.log("1:",data);
                    if(data["code"] == FacadeApp.SuccessCode)   FacadeApp.dispatchAction(CommandList.RANK_GET_LIST1, data['data']);
                    else UIPage.inst(UIPage).ShowPrompt().ShowWindow(FacadeApp._errorCodeSet[data["code"]]);
                }]);
                break;
            case CommandList.M_CMD_UIOPENED_RANK_Tab2:
                this.page._pageNum = 1;
                FacadeApp.fetchData([CommandList.M_NET_RankNum, "&oper=2",], [data=>{
                    // console.log("2:",data);
                    if(data["code"] == FacadeApp.SuccessCode)   FacadeApp.dispatchAction(CommandList.RANK_GET_LIST2, data['data']);
                    else UIPage.inst(UIPage).ShowPrompt().ShowWindow(FacadeApp._errorCodeSet[data["code"]]);
                }]);
                break;
            case CommandList.M_CMD_UIOPENED_RANK_Tab3:
                this.page._pageNum = 2;
                FacadeApp.fetchData([CommandList.M_NET_RankNum, "&oper=3"], [data=>{
                    // console.log("3:",data);
                    if(data["code"] == FacadeApp.SuccessCode)   FacadeApp.dispatchAction(CommandList.RANK_GET_LIST3, data['data']);
                    else UIPage.inst(UIPage).ShowPrompt().ShowWindow(FacadeApp._errorCodeSet[data["code"]]);
                }]);
                break;
        }
    }

    /**
     * 返回关联的UI单元
     */
    public get page(): RankingWindow {
        return <RankingWindow><any>(this.viewComponent);
    }
}
