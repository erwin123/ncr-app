export class Employee{
    UserId: string;
    EmployeeNumber: string;
    Name: string;
    FunctionCode:string;
    FunctionName: string;
    Email: string;
    PhoneNumber: string;
    DriverLicenseNumber: string;
    IsActive: boolean = true;
    IsSelfService: boolean = true;
    IsAdmin: boolean = true;
}
export class NcrReport {
    Id:number=0;
    RowStatus:number = 1;
    ProjectType:string;
    ProjectName:string;
    ProjectID:string;
    LocationID:string;
    ReportBy:string;
    Founder:string;
    ReportNo:string;
    Matters:string;
    RootCause:string;
    Description:string;
    Location:any;
    LocationDetail:string;
    Status:number;
    Scope:string;
    DelayCause:string="";
    SLA:string;
    Notes:string;
    CreateBy:string="";
    CreateDate:string="";
    ActionBy:string="";
    TotalCost:number=0;
    ReportPhotos:any=[];
    ReportProgresses:any=[];
    ReportStatus:number = 0;
    Project:any;
    AssignDate:string="";
    FinishDate:string="";
    Pic:string="";
    SLADesc:string='';
    CloseDate:string="";
    Late:number=0;
    PreventiveAction:string="";
    CorrectiveAction:string="";
}

export class NcrReportProgress {
    Id:number=0;
    RowStatus:number=1;
    Notes:string;
    ProgressStatus:number=0;
    Percentage:number=0;
    Photo:string;
    CreateDate:string="";
    CreateBy:string;
    UpdateDate:string;
    UpdateBy:string;
    ReportID:number;
    Pic:string;
}
export class NcrReportProgressDetail {
    Id:number=0;
    RowStatus:number=1;
    Notes:string;
    Start:string;
    Pause:string;
    Stop:string;
    CreateDate:string;
    CreateBy:string;
    UpdateDate:string;
    UpdateBy:string;
    ReportProgressID:number;
}

export class PushNotif {
    Sender:string;
    Receiver:any = [];
    Message:string;
    Title:string;
}

export class Location {
    Id:number=0;
    RowStatus:number=1;
    LocationName:string ="";
    ProjectID:number;
    CreateBy:string;
    CreateDate:string;
    UpdateBy:string;
    UpdateDate:string;
    Action:number=0;
}

export class Pic {
    Id:number=0;
    RowStatus:number=1;
    PicName:string ="";
    Username:string = "";
    ProjectID:number;
    CreateBy:string;
    CreateDate:string;
    UpdateBy:string;
    UpdateDate:string;
    Action:number=0;
}
/*
ReportStatus
0 : Open
1 : NCR
2 : Progress
3 : Pause
4 : Solved
5 : Close
6 : BASTK
7 : Reject

ProgressStatus
0 : OnPlay
1 : Pause
2 : Finish (Mandatory to upload photo)
3 : Reopen
*/