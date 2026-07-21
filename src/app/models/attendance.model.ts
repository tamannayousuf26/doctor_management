export class AttendanceModel {
    id: number | undefined;
    name: string | undefined;
    present: boolean = false;
    halfPresent: boolean = false;
    absent: boolean = false;
    leave: boolean = false;
}
