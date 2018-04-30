LogDetails = new Mongo.Collection("log_details");
Location = new Mongo.Collection("location");
TimeBlock = new Mongo.Collection("time_block");
ScheduleSubmission = new Mongo.Collection("schedule_submission");
Jmr = new Mongo.Collection("jmr");
Discom = new Mongo.Collection("discom");
ChangeCredential = new Mongo.Collection("change_credential");
StuCharges = new Mongo.Collection("stu_charges");
EnergyInvoiceDetails = new Mongo.Collection("energy_invoice_details");
TransmissionInvoiceDetails = new Mongo.Collection("transmission_invoice_details");
SLDCInvoiceDetails = new Mongo.Collection("sldc_invoice_details");
RLDCInvoiceDetails = new Mongo.Collection("rldc_invoice_details");
IncentiveChargesDetail = new Mongo.Collection("incentive_charges_detail");
InvoiceCharges = new Mongo.Collection("invoice_charges");
DefaultersList = new Mongo.Collection("defaulters_list");
PaymentAdvice = new Mongo.Collection("payment_advice");
EmailLogs = new Mongo.Collection("email_logs");
LogbookDiscom = new Mongo.Collection("logbook_discom");
LogbookTransmission = new Mongo.Collection("logbook_transmission");
LogbookSLDC = new Mongo.Collection("logbook_sldc");
LogbookIncentive = new Mongo.Collection("logbook_incentive");
LogBookSpd = new Mongo.Collection("logbook_spd");
////actual_Generation collection used by JMRDaily which is created below////////
JmrDaily = new Mongo.Collection("jmr_daily");
ReaMonthly = new Mongo.Collection("rea_monthly");
OpenAccessDetails = new Mongo.Collection("open_access_details");
NRWRData = new Mongo.Collection("nr_data");
ERData = new Mongo.Collection("er_data");
DiscomReport= new Mongo.Collection("discom_report");
ReportUrls= new Mongo.Collection("report_urls");
MailTiming = new Mongo.Collection("mail_timing");
SLDCReports = new Mongo.Collection("sldc_reports");
BillingrReports = new Mongo.Collection("billing_reports");
TemporaryInvoice = new Mongo.Collection("temporary_invoice");
RrfData = new Mongo.Collection("rrf_data");
FetchStatus = new Mongo.Collection("fetch_status");
DiscrepancyLog = new Mongo.Collection("discrepancy_log");
EnergyPaymentNoteDetails = new Mongo.Collection("energy_payment_note");
RLDCPaymentNoteDetails = new Mongo.Collection("rldc_payment_note");
SLDCPaymentNoteDetails = new Mongo.Collection("sldc_payment_note");
IncentivePaymentNoteDetails = new Mongo.Collection("incentive_payment_note");
TransmissionPaymentNoteDetails = new Mongo.Collection("transmission_payment_note");
SixLevelApproval = new Mongo.Collection("six_level_approval");
OnlineUsers = new Mongo.Collection("online_users");
ExcelDetails = new Mongo.Collection("excel_details");
EnergyPaymentAdvice = new Mongo.Collection('energy_payment_advice');
UIChargesDataDetails = new Mongo.Collection("ui_charges_details");
//this collection used for six level approval
applicationCollection = new Mongo.Collection("applicationCollection");
ReminderEnergyInvoice = new Mongo.Collection("reminder_energy_invoice");
SeciHolidaysDetails = new Mongo.Collection("seci_holidays");
ModuleLists = new Mongo.Collection("modules_details");
TicketDetails = new Mongo.Collection("ticket_details");
EprocessingFileStatus = new Mongo.Collection("eprocessing_file_status");
Schemes = new Mongo.Collection("schemes");

TranscoSheetSocMoc = new Mongo.Collection("transco_sheet_soc_moc");
TranscoSheetIncentive = new Mongo.Collection("transco_sheet_incentive");
TranscoSheetTransmission = new Mongo.Collection("transco_sheet_transmission");
TranscoSheetSldc = new Mongo.Collection("transco_sheet_sldc");

PaymentReconcilationDiscom = new Mongo.Collection("payment_reconciliation_discom");
PaymentReconcilationSPD = new Mongo.Collection("payment_reconciliation_spd");

SurchargeEnergy = new Mongo.Collection("surcharge_energy");
SurchargeSLDC = new Mongo.Collection("surcharge_SLDC");
SurchargeIncentive = new Mongo.Collection("surcharge_incentive");
SurchargeTransmission = new Mongo.Collection("surcharge_transmission");

CreditDebitEnergy= new Mongo.Collection("credit_debit_energy");
CreditDebitTransmission= new Mongo.Collection("credit_debit_transmission");
CreditDebitSLDC= new Mongo.Collection("credit_debit_sldc");

MasterSheetEntry = new Mongo.Collection("master_sheet_entry");
