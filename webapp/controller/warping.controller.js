sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, UIComponent, JSONModel, MessageBox) {
        "use strict";

        return Controller.extend("WarpingEntry.zppwarpingentry.controller.warping", {
            onInit: function () {
                this.getView().setModel(new sap.ui.model.json.JSONModel(), "TableDataModel");
                this.getView().getModel("TableDataModel").setProperty("/aTableData", []);
                UIComponent.getRouterFor(this).getRoute('warping').attachPatternMatched(this._onRouteMatch, this);
                
            },
            _onRouteMatch: function (oEvent) {
                
                var oCommonModel = this.getOwnerComponent().getModel('oCommonModel');
                var setno = oCommonModel.getProperty('/displayObject').SetNo;
                var Action = oCommonModel.getProperty('/displayObject').Action;
                var oInputForGrossWt = this.getView().byId("Setno");
                oInputForGrossWt.setValue(setno);
                if (Action === "Change") {
                    this.changeset();
                }
                if (Action === "Create") {
                    var dt = new Date();
                    var dt1 = dt.getFullYear() + '-' + Number(dt.getMonth() + 1) + '-' + dt.getDate();
                    var oPayloadObject = {
                        "PostingDate": dt1
                    }
                    this.getView().setModel(new sap.ui.model.json.JSONModel(oPayloadObject), "oPayloadData");
                }
            },
            changeset: function () {
                var oCommonModel = this.getOwnerComponent().getModel('oCommonModel');
                var setno = oCommonModel.getProperty('/displayObject').SetNo;
                var oBusyDialog = new sap.m.BusyDialog({
                    title: "Fetching Data",
                    text: "Please wait ..."
                });
                oBusyDialog.open();
                this.getView().setModel(new sap.ui.model.json.JSONModel(), "TableDataModel");
                this.getView().getModel("TableDataModel").setProperty("/aTableData", []);
                var oModel = this.getView().getModel();
                var TableModel = this.getView().getModel("TableDataModel");
                var aTableArr = TableModel.getProperty("/aTableData");
                var aTablearr = [];
                var aNewArr = [];

                var rebeam = this.getView().byId("Rebeam");
                // var PostingDate = this.getView().byId("PostingDate");
                var yarnco = this.getView().byId("yarn");

                var oFilter1 = new sap.ui.model.Filter("ZfsetNo", "EQ", setno);
                oModel.read("/ChangeEntry", {
                    filters: [oFilter1],
                    success: function (oresponse) {
                        if (oresponse.results.length === 0) {
                            oBusyDialog.close();
                            MessageBox.error("Wrong");
                        }
                        else {

                            var beamno = oresponse.results.length;
                            rebeam.setValue(beamno);

                            var yarncount = oresponse.results[0].Zcount;
                            yarnco.setValue(yarncount);

                            var postdate = oresponse.results[0].zdate;
                            if(postdate === null){
                                var dt = new Date();
                                var dt1 = dt.getFullYear() + '-' + Number(dt.getMonth() + 1) + '-' + dt.getDate();
                                var oPayloadObject = {
                                    "PostingDate": dt1
                                }
                                this.getView().setModel(new sap.ui.model.json.JSONModel(oPayloadObject), "oPayloadData");
                            }
                            else
                            {
                                var dt = postdate;
                                var dt1 = dt.getFullYear() + '-' + Number(dt.getMonth() + 1) + '-' + dt.getDate();
                                var oPayloadObject = {
                                                      "PostingDate": dt1
                                                    }
                                this.getView().setModel(new sap.ui.model.json.JSONModel(oPayloadObject), "oPayloadData");
                            }
                            

                            for (var i = 0; i < oresponse.results.length; i++) {

                                var obj = {
                                    setno: oresponse.results[i].ZfsetNo,
                                    Warpingmcno: oresponse.results[i].ZmcNo,
                                    dyeingsort: oresponse.results[i].Material,
                                    ends: oresponse.results[i].Ends,
                                    Beamno: oresponse.results[i].Beamno,
                                    Beamlength: oresponse.results[i].Beamlenght,
                                    GrossWt: oresponse.results[i].Grooswt,
                                    tarewt: oresponse.results[i].Tarewt,
                                    Netwt: oresponse.results[i].Netwt,
                                    Warper: oresponse.results[i].Warper,
                                    Breaks:oresponse.results[i].breaks,
                                    Breakmilion:oresponse.results[i].breaksmtr
                                }
                                aTableArr.push(obj);
                                TableModel.setProperty("/aTableData", aTableArr)
                            }
                            oBusyDialog.close();
                            this.TotalingValueField();
                        }

                    }.bind(this),
                    error: function (results) {
                        oBusyDialog.close();
                        MessageBox.error(" Wrong ");

                    }
                })

            },
            onaddtable: function () {
                var oBusyDialog = new sap.m.BusyDialog({
                    title: "Fetching Data",
                    text: "Please wait ..."
                });
                oBusyDialog.open();
                var oCommonModel = this.getOwnerComponent().getModel('oCommonModel');
                var setno = oCommonModel.getProperty('/displayObject').SetNo;
                var Action = oCommonModel.getProperty('/displayObject').Action;
                if (Action === "Change") {
                    var tabl = this.getView().getModel("TableDataModel").getProperty("/aTableData");
                    var noofbeam = Number(this.getView().byId("Rebeam").getValue());
                    var length = noofbeam - tabl.length;
                    var oInputForGrossWt = this.getView().byId("TotalEnd");
                    // if(tabl.length<= length){
                    //     oBusyDialog.close();
                    //   MessageBox.error("Wrong No Of Beam");
                    // }
                    // else{
                        var TableModel = this.getView().getModel("TableDataModel");
                    var aTableArr = TableModel.getProperty("/aTableData");
                    var oModel = this.getView().getModel();
                    var oInput = this.getView().byId("idsetlength"); 
                    var oInput1 = this.getView().byId("yarn");
                    var ProductionOrder =  this.getView().byId("idProductionOrder"); 
                    var oFilter1 = new sap.ui.model.Filter("ZfsetNo", "EQ", setno);
                    oModel.read("/Warping_Entry", {
                        filters: [oFilter1],
                        success: function (oresponse) {
                            if (oresponse.results.length === 0) {
                                oBusyDialog.close();
                                MessageBox.error("Wrong");
                            }
                            else {
                                var totalends  = Number(oresponse.results[0].Toatlends);
                                oInputForGrossWt.setValue(totalends);
                                var setlength =oresponse.results[0].Zlength;
                                oInput.setValue(setlength);
                                var ProductionOrder1 =oresponse.results[0].ManufacturingOrder; 
                                ProductionOrder.setValue(ProductionOrder1);  
                                  
                                var warpcount1 =oresponse.results[0].warpcount1; 
                                oInput1.setValue(warpcount1);  
                                for (var i = 0; i < length; i++) {
                                        var totend = Number(oresponse.results[0].Toatlends) / noofbeam;
                                        var setlength = Number(oresponse.results[0].Zlength);
                                        var a = totend * 0.595;
                                        var b = a / yarnc;
                                        var c = b / 1000;
                                        var Gross = c * setlength;
                                    var obj = {
                                        setno: setno,
                                        Warpingmcno: oresponse.results[0].ZmcNo,
                                        dyeingsort: oresponse.results[0].material,
                                        ends: totend.toFixed(0),
                                        Beamno: "",
                                   //     Beamlength:oresponse.results[0].Zlength,
                                        Beamlength:oresponse.results[0].ActualDeliveredQuantity,
                                   
                                        GrossWt: Gross.toFixed(3),
                                        tarewt: "",
                                        Netwt: "",
                                        Warper: "",
                                        Breaks:"",
                                        Breakmilion:""
                                    }
                                    aTableArr.push(obj);
                                    TableModel.setProperty("/aTableData", aTableArr)
                                }
                            }
                            oBusyDialog.close();
                            this.TotalingValueField();
                            this.diffsetlength();

                        }.bind(this),
                        error: function (results) {
                            oBusyDialog.close();
                            MessageBox.error(" Wrong ");

                        }
                    })

                    // }
                    

                }
                else {


                    var date = new Date();

                    var newdate =  date.getFullYear() + '-' + Number(date.getMonth() + 1) + '-' + date.getDate();
                    
                    if (newdate.length === 10) {
                        var yyyy = newdate.slice(0, 4);
                        var mm = newdate.slice(5, 7);
                        var dd = newdate.slice(8, 10);
                        var dte8 =yyyy+'-'+mm+'-'+dd;
                    }
                    else if (newdate.length === 9) {
                        var yyyy = newdate.slice(0, 4);
                        var mm = newdate.slice(5,7);
                        if(mm.slice(1,2) === '-'){
                            var mm = newdate.slice(5, 6);
                            mm = "0" + mm;
                            var dd =newdate.slice(7, 9);
                        }
                        else{
                            var mm = newdate.slice(5,7);
                            var dd =newdate.slice(8, 9);
                            dd = "0" + dd;
                        }
                        var dte8 =yyyy+'-'+mm+'-'+dd;
                    }
                    else if (newdate.length === 8) {
                        var yyyy = newdate.slice(0, 4);
                        var mm = newdate.slice(5, 6);
                        mm = "0" + mm;
                        var dd = newdate.slice(7, 8);
                        dd = "0" + dd;
                        var dte8 =yyyy+'-'+mm+'-'+dd;
                    }
    
                    var newdate = dte8;
    
                    var dateObj = new Date();
    
                    // Subtract six day from current time					
                    dateObj.setDate(dateObj.getDate() - 5);
    
                    var backdate =  dateObj.getFullYear() + '-' + Number(dateObj.getMonth() + 1) + '-' + dateObj.getDate();
    
                    if (backdate.length === 10) {
                        var yyyy = backdate.slice(0, 4);
                        var mm = backdate.slice(5, 7);
                        var dd = backdate.slice(8, 10);
                        var dte =yyyy+'-'+mm+'-'+dd;
                    }
                    else if (backdate.length === 9) {
                        var yyyy = backdate.slice(0, 4);
                        var mm = backdate.slice(5,7);
                        if(mm.slice(1,2) === '-'){
                            var mm = backdate.slice(5, 6);
                            mm = "0" + mm;
                            var dd =backdate.slice(7, 9);
                        }
                        else{
                            var mm = backdate.slice(5,7);
                            var dd =backdate.slice(8, 9);
                            dd = "0" + dd;
                        }
                        var dte =yyyy+'-'+mm+'-'+dd;
                    }
                    else if (backdate.length === 8) {
                        var yyyy = backdate.slice(0, 4);
                        var mm = backdate.slice(5, 6);
                        mm = "0" + mm;
                        var dd = backdate.slice(7, 8);
                        dd = "0" + dd;
                        var dte =yyyy+'-'+mm+'-'+dd;
                    }
    
                    var backdate = dte;
    
                    var dateObj1 = new Date();
    
                    // Subtract four day from current time					
                    dateObj1.setDate(dateObj1.getDate() - 4);
    
                    var backdate1 =  dateObj1.getFullYear() + '-' + Number(dateObj1.getMonth() + 1) + '-' + dateObj1.getDate();
    
                    if (backdate1.length === 10) {
                        var yyyy = backdate1.slice(0, 4);
                        var mm = backdate1.slice(5, 7);
                        var dd = backdate1.slice(8, 10);
                        var dte1 =yyyy+'-'+mm+'-'+dd;
                    }
                    else if (backdate1.length === 9) {
                        var yyyy = backdate1.slice(0, 4);
                        var mm = backdate1.slice(5,7);
                        if(mm.slice(1,2) === '-'){
                            var mm = backdate1.slice(5, 6);
                            mm = "0" + mm;
                            var dd =backdate1.slice(7, 9);
                        }
                        else{
                            var mm = backdate1.slice(5,7);
                            var dd =backdate1.slice(8, 9);
                            dd = "0" + dd;
                        }
                        var dte1 =yyyy+'-'+mm+'-'+dd;
                    }
                    else if (backdate1.length === 8) {
                        var yyyy = backdate1.slice(0, 4);
                        var mm = backdate1.slice(5, 6);
                        mm = "0" + mm;
                        var dd = backdate1.slice(7, 8);
                        dd = "0" + dd;
                        var dte1 =yyyy+'-'+mm+'-'+dd;
                    }
    
                    var backdate1 = dte1;
    
                    var dateObj2 = new Date();
    
                    // Subtract three day from current time					
                    dateObj2.setDate(dateObj2.getDate() - 3);
    
                    var backdate2 =  dateObj2.getFullYear() + '-' + Number(dateObj2.getMonth() + 1) + '-' + dateObj2.getDate();
    
                    if (backdate2.length === 10) {
                        var yyyy = backdate2.slice(0, 4);
                        var mm = backdate2.slice(5, 7);
                        var dd = backdate2.slice(8, 10);
                        var dte2 =yyyy+'-'+mm+'-'+dd;
                    }
                    else if (backdate2.length === 9) {
                        var yyyy = backdate2.slice(0, 4);
                        var mm = backdate2.slice(5,7);
                        if(mm.slice(1,2) === '-'){
                            var mm = backdate2.slice(5, 6);
                            mm = "0" + mm;
                            var dd =backdate2.slice(7, 9);
                        }
                        else{
                            var mm = backdate2.slice(5,7);
                            var dd =backdate2.slice(8, 9);
                            dd = "0" + dd;
                        }
                        var dte2 =yyyy+'-'+mm+'-'+dd;
                    }
                    else if (backdate2.length === 8) {
                        var yyyy = backdate2.slice(0, 4);
                        var mm = backdate2.slice(5, 6);
                        mm = "0" + mm;
                        var dd = backdate2.slice(7, 8);
                        dd = "0" + dd;
                        var dte2 =yyyy+'-'+mm+'-'+dd;
                    }
    
                    var backdate2 = dte2;
    
                    var dateObj3 = new Date();
    
                    // Subtract two day from current time					
                    dateObj3.setDate(dateObj3.getDate() - 2);
    
                    var backdate3 =  dateObj3.getFullYear() + '-' + Number(dateObj3.getMonth() + 1) + '-' + dateObj3.getDate();
                    
                    if (backdate3.length === 10) {
                        var yyyy = backdate3.slice(0, 4);
                        var mm = backdate3.slice(5, 7);
                        var dd = backdate3.slice(8, 10);
                        var dte3 =yyyy+'-'+mm+'-'+dd;
                    }
                    else if (backdate3.length === 9) {
                        var yyyy = backdate3.slice(0, 4);
                        var mm = backdate3.slice(5,7);
                        if(mm.slice(1,2) === '-'){
                            var mm = backdate3.slice(5, 6);
                            mm = "0" + mm;
                            var dd =backdate3.slice(7, 9);
                        }
                        else{
                            var mm = backdate3.slice(5,7);
                            var dd =backdate3.slice(8, 9);
                            dd = "0" + dd;
                        }
                        var dte3 =yyyy+'-'+mm+'-'+dd;
                    }
                    else if (backdate3.length === 8) {
                        var yyyy = backdate3.slice(0, 4);
                        var mm = backdate3.slice(5, 6);
                        mm = "0" + mm;
                        var dd = backdate3.slice(7, 8);
                        dd = "0" + dd;
                        var dte3 =yyyy+'-'+mm+'-'+dd;
                    }
    
                    var backdate3 = dte3;
    
                    var dateObj4 = new Date();
    
                    // Subtract one day from current time					
                    dateObj4.setDate(dateObj4.getDate() - 1);
    
                    var backdate4 =  dateObj4.getFullYear() + '-' + Number(dateObj4.getMonth() + 1) + '-' + dateObj4.getDate();
    
                    if (backdate4.length === 10) {
                        var yyyy = backdate4.slice(0, 4);
                        var mm = backdate4.slice(5, 7);
                        var dd = backdate4.slice(8, 10);
                        var dte4 =yyyy+'-'+mm+'-'+dd;
                    }
                    else if (backdate4.length === 9) {
                        var yyyy = backdate4.slice(0, 4);
                        var mm = backdate4.slice(5,7);
                        if(mm.slice(1,2) === '-'){
                            var mm = backdate4.slice(5, 6);
                            mm = "0" + mm;
                            var dd =backdate4.slice(7, 9);
                        }
                        else{
                            var mm = backdate4.slice(5,7);
                            var dd =backdate4.slice(8, 9);
                            dd = "0" + dd;
                        }
                        var dte4 =yyyy+'-'+mm+'-'+dd;
                    }
                    else if (backdate4.length === 8) {
                        var yyyy = backdate4.slice(0, 4);
                        var mm = backdate4.slice(5, 6);
                        mm = "0" + mm;
                        var dd = backdate4.slice(7, 8);
                        dd = "0" + dd;
                        var dte4 =yyyy+'-'+mm+'-'+dd;
                    }
    
                    var backdate4 = dte4;





                    var noofbeam = this.getView().byId("Rebeam").getValue();
                    
                    var setno = this.getView().byId("Setno").getValue();
                    if (setno === "") {
                        oBusyDialog.close();
                        MessageBox.error(" Please Fill Set No");
                    }
                    else if (noofbeam === "") {
                        oBusyDialog.close();
                        MessageBox.error(" Please No. Of Beam");
                    }
                    else {
                        this.getView().setModel(new sap.ui.model.json.JSONModel(), "TableDataModel");
                        this.getView().getModel("TableDataModel").setProperty("/aTableData", []);
                        var oModel = this.getView().getModel();
                        var TableModel = this.getView().getModel("TableDataModel");
                        var aTableArr = TableModel.getProperty("/aTableData");
                        var beamno = Number(this.getView().byId("Rebeam").getValue());
                        var yarnc = Number(this.getView().byId("yarn").getValue());
                        var setno = this.getView().byId("Setno").getValue();
                        var ProductionOrder =  this.getView().byId("idProductionOrder"); 
                        var aTablearr = [];
                        var aNewArr = [];
                        var oInputForGrossWt = this.getView().byId("TotalEnd");
                        var oInput = this.getView().byId("idsetlength"); 
                        var oInput1 = this.getView().byId("yarn"); 
                        var oFilter1 = new sap.ui.model.Filter("ZfsetNo", "EQ", setno);
                        oModel.read("/Warping_Entry", {
                            filters: [oFilter1],
                            success: function (oresponse) {
                                if (oresponse.results.length === 0) {
                                    oBusyDialog.close();
                                    MessageBox.error("Wrong");
                                }
                                else {

                                    var setdate  = oresponse.results[0].SateDate;
                                    var SetApproved  = oresponse.results[0].SetApproved;

                                    var setdate1 =  setdate.getFullYear() + '-' + Number(setdate.getMonth() + 1) + '-' + setdate.getDate();
    
                                    if (setdate1.length === 10) {
                        var yyyy = setdate1.slice(0, 4);
                        var mm = setdate1.slice(5, 7);
                        var dd = setdate1.slice(8, 10);
                        var dte9 =yyyy+'-'+mm+'-'+dd;
                                      }
                                    else if (setdate1.length === 9) {
                        var yyyy = setdate1.slice(0, 4);
                        var mm = setdate1.slice(5,7);
                        if(mm.slice(1,2) === '-'){
                            var mm = setdate1.slice(5, 6);
                            mm = "0" + mm;
                            var dd =setdate1.slice(7, 9);
                        }
                        else{
                            var mm = setdate1.slice(5,7);
                            var dd =setdate1.slice(8, 9);
                            dd = "0" + dd;
                        }
                        var dte9 =yyyy+'-'+mm+'-'+dd;
                                      }
                                    else if (setdate1.length === 8) {
                        var yyyy = setdate1.slice(0, 4);
                        var mm = setdate1.slice(5, 6);
                        mm = "0" + mm;
                        var dd = setdate1.slice(7, 8);
                        dd = "0" + dd;
                        var dte9 =yyyy+'-'+mm+'-'+dd;
                                      }
                                     var InvoiceDate = dte9;
                                    if (InvoiceDate === newdate || InvoiceDate === backdate4 || InvoiceDate === backdate3 || InvoiceDate === backdate2 || InvoiceDate === backdate1 || InvoiceDate === backdate || SetApproved != ""){
                                        
                                        
                                        var totalends  = Number(oresponse.results[0].Toatlends);
                                        if(totalends === 0){
                                            oBusyDialog.close();
                                            MessageBox.error("Please maintain Master Card for this Sort");
                                        }
                                        else{
                                            oInputForGrossWt.setValue(totalends);
                                            var setlength =oresponse.results[0].Zlength;
                                            oInput.setValue(setlength);  
                                            var ProductionOrder =  this.getView().byId("idProductionOrder"); 
                                            var ProductionOrder1 =oresponse.results[0].ManufacturingOrder; 
                                            ProductionOrder.setValue(ProductionOrder1); 
                                            
                                            var warpcount1 =oresponse.results[0].warpcount1; 
                                            if(warpcount1 === ""){
                                                oBusyDialog.close();
                                                MessageBox.error("Please maintain Sort Master for this Sort");
                                            }
                                            else{
                                                oInput1.setValue(warpcount1);  
    
                                            for (var i = 0; i < beamno; i++) {
                                                var totend = Number(oresponse.results[0].Toatlends) / beamno;
                                                var setlength = Number(oresponse.results[0].Zlength);
                                                var a = totend * 0.595;
                                                var b = a / yarnc;
                                                var c = b / 1000;
                                                var Gross = c * setlength;
                                                var obj = {
                                                    setno: setno,
                                                    // setlength: oresponse.results[0].Zlength,
                                                    Warpingmcno: oresponse.results[0].ZmcNo,
                                                    dyeingsort: oresponse.results[0].material,
                                                    ends: totend.toFixed(0),
                                                    Beamno: "",
                                        //            Beamlength: oresponse.results[0].Zlength,
                                                    Beamlength: oresponse.results[0].ActualDeliveredQuantity,

                                                    GrossWt: "",
                                                    tarewt: "",
                                                    Netwt: "",
                                                    Warper: oresponse.results[0].Warper,
                                                    Breaks:"",
                                                    Breakmilion:""
                                                }
                                                aTableArr.push(obj);
                                                TableModel.setProperty("/aTableData", aTableArr)
                                            }
                                            oBusyDialog.close();
                                            this.TotalingValueField();
                                            this.diffsetlength();
                                        }
                                        
                                            }
                                    }
                                    else{
                                        oBusyDialog.close();
                                        MessageBox.error("The Set Creation date is currently 5 days overdue, so kindly approve this Set Number from Management.");
                                    }

                                    }
                                   

                            }.bind(this),
                            error: function (results) {
                                oBusyDialog.close();
                                MessageBox.error(" Wrong ");

                            }
                        })


                    }
                }



            },
            handleDelete: function (oEvent) {
                var oTable = oEvent.getSource().getParent().getParent();
                var aSelectedIndex = oTable.getSelectedIndices();
                var aTableArr = this.getView().getModel("TableDataModel").getProperty("/aTableData")
                var aNewArr = []
                for (var i = 0; i < aTableArr.length; i++) {
                    var ind = aSelectedIndex.indexOf(i)
                    if(ind == -1){
                        aNewArr.push(aTableArr[i])
                    }
                }
                this.getView().getModel("TableDataModel").setProperty("/aTableData", aNewArr);




            },
            total: function (oEvent) {
                var oContext = oEvent.getSource().getBindingContext('TableDataModel').getObject();
                var beamno =oContext.Beamno;
                var oBusyDialog = new sap.m.BusyDialog({
                    title: "Fetching Data",
                    text: "Please wait ..."
                });
                oBusyDialog.open();
                
                var count = Number(this.getView().byId("yarn").getValue());
                var tabledata = this.getView().getModel("TableDataModel").getProperty("/aTableData");
                this.getView().setModel(new sap.ui.model.json.JSONModel(), "TableDataModel");
                this.getView().getModel("TableDataModel").setProperty("/aTableData", []);
                var oModel = this.getView().getModel();
                var TableModel = this.getView().getModel("TableDataModel");
                var aTableArr = TableModel.getProperty("/aTableData");
                var setno = this.getView().byId("Setno").getValue();
                var oFilter1 = new sap.ui.model.Filter("Beamno", "EQ", beamno);
                oModel.read("/BeamNo", {
                    filters: [oFilter1],
                    success: function (oresponse) {
                        if (oresponse.results.length === 0) {
                            oBusyDialog.close();
                            MessageBox.error(" Wrong Set No Input ");
                        }
                        else {
                            var wt=oresponse.results[0].Beamwt;
                            for(var i=0;i<tabledata.length;i++){
                                if(tabledata[i].Beamno === beamno){
                                    var ends =Number(tabledata[i].ends);
                                    var length = Number(tabledata[i].Beamlength);
                                    var tarewt =Number(wt);
                                    var a = ends / 1693;
                                    var b = a /count;
                                    var c = b  * length;
                                    var d = c + tarewt;
                                    var obj = {
                                        setno:tabledata[i].setno,
                                        setlength: tabledata[i].setlength,
                                        Warpingmcno: tabledata[i].Warpingmcno,
                                        dyeingsort: tabledata[i].dyeingsort,
                                        ends: tabledata[i].ends,
                                        Beamno:tabledata[i].Beamno,
                                        Beamlength: tabledata[i].Beamlength,
                                        GrossWt: d.toFixed(3),
                                        tarewt: wt,
                                        Netwt: c.toFixed(3),
                                        RPM: tabledata[i].RPM,
                                        Warper: tabledata[i].Warper,
                                        Breaks:tabledata[i].Breaks,
                                        Breakmilion:tabledata[i].Breakmilion
                                    }
                                    aTableArr.push(obj);
                                    TableModel.setProperty("/aTableData", aTableArr)
    
                                }
                                else{
                                    var obj = {
                                        setno:tabledata[i].setno,
                                        setlength: tabledata[i].setlength,
                                        Warpingmcno: tabledata[i].Warpingmcno,
                                        dyeingsort: tabledata[i].dyeingsort,
                                        ends: tabledata[i].ends,
                                        Beamno:tabledata[i].Beamno,
                                        Beamlength: tabledata[i].Beamlength,
                                        GrossWt: tabledata[i].GrossWt,
                                        tarewt: tabledata[i].tarewt,
                                        Netwt: tabledata[i].Netwt,
                                        RPM: tabledata[i].RPM,
                                        Warper: tabledata[i].Warper,
                                        Breaks:tabledata[i].Breaks,
                                        Breakmilion:tabledata[i].Breakmilion
                                    }
                                    aTableArr.push(obj);
                                    TableModel.setProperty("/aTableData", aTableArr)
                                   
                                 }
                                 
                            }
                            oBusyDialog.close(); 
                        }
                        oBusyDialog.close();

                    }.bind(this),
                    error: function (results) {
                        oBusyDialog.close();
                        MessageBox.error(" Wrong Set No Input ");

                    }
                })
                   
               
                
            },
            ontotalnetwt:function(oEvent){
                var oBusyDialog = new sap.m.BusyDialog({
                    title: "Fetching Data",
                    text: "Please wait ..."
                });
                oBusyDialog.open();
                var count = Number(this.getView().byId("yarn").getValue());
                var oContext = oEvent.getSource().getBindingContext('TableDataModel').getObject();  
                var ends =Number(oContext.ends);
                var length = Number(oContext.Beamlength);
                var tarewt =Number(oContext.tarewt);
              
                var a = ends / 1693;
                var b = a /count;
                var c = b  * length;
                var d = c + tarewt;
                d= d.toFixed(3);
                c = c.toFixed(3);
                
                if(oContext.Breaks !=""){
                var Breaks =Number(oContext.Breaks);
                var k = Breaks * 1000000;
                var l = k /length;
                var m = l  / ends;
                m = m.toFixed(3);
                oEvent.getSource().getBindingContext("TableDataModel").getObject().Breakmilion = m
                }
          
                oEvent.getSource().getBindingContext("TableDataModel").getObject().Netwt = c
                oEvent.getSource().getBindingContext("TableDataModel").getObject().GrossWt = d
                oBusyDialog.close();
                
            },
            TotalingValueField: function () {
                var oBusyDialog = new sap.m.BusyDialog({
                    title: "Fetching Data",
                    text: "Please wait ..."
                });
                oBusyDialog.open();
                var oTableEmptyRowFoundData = this.getView().getModel("TableDataModel").getProperty("/aTableData");
                var ArrayVarForNetwt = [];
                var ArrayVarForTarewt = [];
                var ArrayVarForGrossWt = [];
                var ArrayVarForTotalEnds = [];
                var arrayvarforbeamlength =[];
                oTableEmptyRowFoundData.map(function (items) {
                    var var1 = items.GrossWt;
                    var var2 = items.tarewt;
                    var var3 = items.Netwt;
                    var var4 = items.ends;
                    var var5 = items.Beamlength;
                    if (ArrayVarForTotalEnds.length < 1) {

                        ArrayVarForTotalEnds.push(var4);
                    }
                    if (var1 != "") {
                        var Var11 = parseFloat(var1);
                        ArrayVarForGrossWt.push(Var11);

                    }
                    if (var2 != "") {
                        var Var22 = parseFloat(var2);
                        ArrayVarForTarewt.push(Var22);

                    }
                    if (var3 != "") {
                        var Var33 = parseFloat(var3);
                        ArrayVarForNetwt.push(Var33);

                    }
                    if(var5 != ""){
                        var var44 = parseFloat(var5);
                        arrayvarforbeamlength.push(var44);
                    }

                })
               
               

                //Gross Wt Toteling
                var GrossWt = 0;
                var arrayLen1 = ArrayVarForGrossWt.length;
                for (var d = 0; d < arrayLen1; d++) {
                    GrossWt += ArrayVarForGrossWt[d];
                }
                var oInputForGrossWt = this.getView().byId("GrossWt");
                GrossWt = GrossWt.toFixed(3);
                oInputForGrossWt.setValue(GrossWt)

                //Tare Wt Toteling
                var TareWt = 0;
                var arrayLen2 = ArrayVarForTarewt.length;
                for (var s = 0; s < arrayLen2; s++) {
                    TareWt += ArrayVarForTarewt[s];
                }
                var oInputForTareWt = this.getView().byId("TareWt");
                TareWt =TareWt.toFixed(3);
                oInputForTareWt.setValue(TareWt)

                //Net Wt Toteling
                var NetWt = 0;
                var arrayLen3 = ArrayVarForTarewt.length;
                for (var r = 0; r < arrayLen3; r++) {
                    NetWt += ArrayVarForNetwt[r];
                }
                NetWt= NetWt.toFixed(3);
                var oInputForNetWt = this.getView().byId("NetWt");
                oInputForNetWt.setValue(NetWt)

                // idutilizedsetlength totaling
                var utlizedsetlength = 0;
                var arrayLen4 = arrayvarforbeamlength.length;
                for (var s = 0; s < arrayLen4; s++) {
                    utlizedsetlength += arrayvarforbeamlength[s];
                }
                var oInputForTareWt = this.getView().byId("idutilizedsetlength");
                utlizedsetlength =utlizedsetlength.toFixed(3);
                oInputForTareWt.setValue(utlizedsetlength)

                oBusyDialog.close();
            },
            diffsetlength:function(){
                var oInput = this.getView().byId("iddiffsetlength"); 
                var setlength = Number(this.getView().byId("idsetlength").getValue()); 
                var utilizedsetlength = Number(this.getView().byId("idutilizedsetlength").getValue()); 
                var a = setlength - utilizedsetlength;
                oInput.setValue(a);  
            },
            saveData: function () {
                var oCommonModel = this.getOwnerComponent().getModel('oCommonModel');
                var setno = oCommonModel.getProperty('/displayObject').SetNo;
                var Action = oCommonModel.getProperty('/displayObject').Action;
                var oBusyDialog = new sap.m.BusyDialog({
                    title: "Save Data",
                    text: "Please wait "
                });
                var beamin1creel = this.getView().byId("beamin1creel").getValue();
                var supplierconweight = this.getView().byId("supplierconweight").getValue();
                if(beamin1creel === ""){
                   MessageBox.error("Please Enter Beam in 1 Creel....");
                }
                else if(supplierconweight === ""){
                    MessageBox.error("Please Enter Supplier Con Weight....");
                }
                else{
                    oBusyDialog.open();
                    if (Action === "Change"){
                        var beamno = this.getView().byId("Rebeam").getValue();
                        var yarnc = this.getView().byId("yarn").getValue();
                        var setno = this.getView().byId("Setno").getValue();
                        var docdate = this.getView().byId("PostingDate").getValue();
                    if (docdate.length === 10) {
                        var yyyy = docdate.slice(0, 4);
                        var mm = docdate.slice(5, 7);
                        var dd = docdate.slice(8, 10);
                        var dte = yyyy + mm + dd;
                    }
                    else if (docdate.length === 9) {
                        var yyyy = docdate.slice(0, 4);
                        var mm = docdate.slice(5,7);
                        if(mm.slice(1,2) === '-'){
                            var mm = docdate.slice(5, 6);
                            mm = "0" + mm;
                            var dd =docdate.slice(7, 9);
                        }
                        else{
                            var mm = docdate.slice(5,7);
                            var dd =docdate.slice(8, 9);
                            dd = "0" + dd;
                        }
                        var dte = yyyy + mm + dd;
                    }
                    else if (docdate.length === 8) {
                        var yyyy = docdate.slice(0, 4);
                        var mm = docdate.slice(5, 6);
                        mm = "0" + mm;
                        var dd = docdate.slice(7, 8);
                        dd = "0" + dd;
                        var dte = yyyy + mm + dd;
                    }
    
                    var PostingDate  = dte;
                        var TotalEnd = this.getView().byId("TotalEnd").getValue();
                        var AVGBPMM = this.getView().byId("AVGBPMM").getValue();
                        var utilizedsetlength = this.getView().byId("idutilizedsetlength").getValue();
                        var setlength = this.getView().byId("idsetlength").getValue();
                        var Dyectable = this.getView().getModel("TableDataModel").getProperty("/aTableData");
                        var TableDataArray = [];
                        Dyectable.map(function (items) {
                            var oTableData = {
                                setno: items.setno,
                                Warpingmcno: items.Warpingmcno,
                                dyeingsort: items.dyeingsort,
                                ends: items.ends,
                                Beamno: items.Beamno,
                                Beamlength: items.Beamlength,
                                GrossWt: items.GrossWt,
                                tarewt: items.tarewt,
                                Netwt: items.Netwt,
                                Warper: items.Warper,
                                Breaks:items.Breaks,
                                Breakmilion:items.Breakmilion
        
                            }
                            TableDataArray.push(oTableData);
                        }.bind(this))
                        // https://my405100.s4hana.cloud.sap:443/sap/bc/http/sap/zwarping_entry_http?sap-client=080
        
                        var url1 = "/sap/bc/http/sap/zwarping_entry_http?sap-client=080";
                        var url2 = "&Action="
                        var url3 = url2 + Action;
                        var url = url1 + url2 + url3;
        
                        $.ajax({
                            type: "post",
                            url: url,
                            data: JSON.stringify({
                                beamin1creel,
                                supplierconweight,
                                AVGBPMM,
                                beamno,
                                yarnc,
                                setno, 
                                utilizedsetlength,
                                setlength,
                                TotalEnd,
                                PostingDate,
                                tabledata: TableDataArray,
                            }),
                            contentType: "application/json; charset=utf-8",
                            traditional: true,
                            success: function (data) {
                                oBusyDialog.close();
                                MessageBox.alert(data, {
                                    onClose: function (oAction) {
                                        if (oAction === MessageBox.Action.OK) {
                                            var oHistory = sap.ui.core.routing.History.getInstance();
                                            var sPreviousHash = oHistory.getPreviousHash();
        
                                            if (sPreviousHash !== undefined) {
                                                window.history.go(-1);
                                            } else {
                                                var oRouter = this.getOwnerComponent().getRouter();
                                                oRouter.navTo("View1", {}, true);
                                            }
                                        }
                                    }.bind(this)
                                });
                            }.bind(this),
                            error: function (error) {
                                oBusyDialog.close();
                                MessageBox.show(error, {
                                    title: "Warning",
                                    icon: MessageBox.Icon.ERROR,
                                    onClose: function (oAction) {
                                        if (oAction === MessageBox.Action.OK) {
                                            var oHistory = sap.ui.core.routing.History.getInstance();
                                            var sPreviousHash = oHistory.getPreviousHash();
        
                                            if (sPreviousHash !== undefined) {
                                                window.history.go(-1);
                                            } else {
                                                var oRouter = this.getOwnerComponent().getRouter();
                                                oRouter.navTo("Gate", {}, true);
                                            }
                                        }
                                    }.bind(this)
                                });
                            }
        
                        });
                    }
                    else{
                        var AVGBPMM = this.getView().byId("AVGBPMM").getValue();
                        var beamno = this.getView().byId("Rebeam").getValue();
                        var yarnc = this.getView().byId("yarn").getValue();
                        var setno = this.getView().byId("Setno").getValue();
                        var TotalEnd = this.getView().byId("TotalEnd").getValue();
                        var utilizedsetlength = this.getView().byId("idutilizedsetlength").getValue();
                        
                    var docdate = this.getView().byId("PostingDate").getValue();
                    if (docdate.length === 10) {
                        var yyyy = docdate.slice(0, 4);
                        var mm = docdate.slice(5, 7);
                        var dd = docdate.slice(8, 10);
                        var dte = yyyy + mm + dd;
                    }
                    else if (docdate.length === 9) {
                        var yyyy = docdate.slice(0, 4);
                        var mm = docdate.slice(5,7);
                        if(mm.slice(1,2) === '-'){
                            var mm = docdate.slice(5, 6);
                            mm = "0" + mm;
                            var dd =docdate.slice(7, 9);
                        }
                        else{
                            var mm = docdate.slice(5,7);
                            var dd =docdate.slice(8, 9);
                            dd = "0" + dd;
                        }
                        var dte = yyyy + mm + dd;
                    }
                    else if (docdate.length === 8) {
                        var yyyy = docdate.slice(0, 4);
                        var mm = docdate.slice(5, 6);
                        mm = "0" + mm;
                        var dd = docdate.slice(7, 8);
                        dd = "0" + dd;
                        var dte = yyyy + mm + dd;
                    }
    
                    var PostingDate  = dte;
    
                        var setlength = this.getView().byId("idsetlength").getValue();
                        var Dyectable = this.getView().getModel("TableDataModel").getProperty("/aTableData");
                        var TableDataArray = [];
                        Dyectable.map(function (items) {
                            var oTableData = {
                                setno: items.setno,
                                Warpingmcno: items.Warpingmcno,
                                dyeingsort: items.dyeingsort,
                                ends: items.ends,
                                Beamno: items.Beamno,
                                Beamlength: items.Beamlength,
                                GrossWt: items.GrossWt,
                                tarewt: items.tarewt,
                                Netwt: items.Netwt,
                                Warper: items.Warper,
                                Breaks:items.Breaks,
                                Breakmilion:items.Breakmilion
        
                            }
                            TableDataArray.push(oTableData);
                        }.bind(this))
                        // https://my405100.s4hana.cloud.sap:443/sap/bc/http/sap/zwarping_entry_http?sap-client=080
        
                        var url1 = "/sap/bc/http/sap/zwarping_entry_http?sap-client=080";
                        var url2 = "&Action="
                        var url3 = url2 + Action;
                        var url = url1 + url2 + url3;
        
                        $.ajax({
                            type: "post",
                            url: url,
                            data: JSON.stringify({
                                beamin1creel,
                                supplierconweight,
                                AVGBPMM,
                                beamno,
                                yarnc,
                                setno,
                                utilizedsetlength,
                                setlength,
                                TotalEnd,
                                PostingDate,
                                tabledata: TableDataArray,
                            }),
                            contentType: "application/json; charset=utf-8",
                            traditional: true,
                            success: function (data) {
                                oBusyDialog.close();
                                MessageBox.alert(data, {
                                    onClose: function (oAction) {
                                        if (oAction === MessageBox.Action.OK) {
                                            var oHistory = sap.ui.core.routing.History.getInstance();
                                            var sPreviousHash = oHistory.getPreviousHash();
        
                                            if (sPreviousHash !== undefined) {
                                                window.history.go(-1);
                                            } else {
                                                var oRouter = this.getOwnerComponent().getRouter();
                                                oRouter.navTo("View1", {}, true);
                                            }
                                        }
                                    }.bind(this)
                                });
                            }.bind(this),
                            error: function (error) {
                                oBusyDialog.close();
                                MessageBox.show(error, {
                                    title: "Warning",
                                    icon: MessageBox.Icon.ERROR,
                                    onClose: function (oAction) {
                                        if (oAction === MessageBox.Action.OK) {
                                            var oHistory = sap.ui.core.routing.History.getInstance();
                                            var sPreviousHash = oHistory.getPreviousHash();
        
                                            if (sPreviousHash !== undefined) {
                                                window.history.go(-1);
                                            } else {
                                                var oRouter = this.getOwnerComponent().getRouter();
                                                oRouter.navTo("Gate", {}, true);
                                            }
                                        }
                                    }.bind(this)
                                });
                            }
        
                        });
                    }
                }
                
               

            },
            setnocheck: function () {
                var oModel = this.getView().getModel();
                var setno = this.getView().byId("Setno").getValue();
                var oFilter1 = new sap.ui.model.Filter("ZfsetNo", "EQ", setno);
                oModel.read("/Set_No_Cheack", {
                    filters: [oFilter1],
                    success: function (oresponse) {
                        if (oresponse.results.length === 0) {

                        }
                        else if (oresponse.results[0].ZfsetNo === setno) {
                            MessageBox.error("Wrong Set No Is already");
                        }

                    }.bind(this),
                    error: function (results) {
                        oBusyDialog.close();
                        MessageBox.error(" Wrong Set No Input ");

                    }
                })



            },
            Breaks:function(oEvent){ 
            var oBusyDialog = new sap.m.BusyDialog({
                title: "Fetching Data",
                text: "Please wait ..."
            });
            oBusyDialog.open();
            var oContext = oEvent.getSource().getBindingContext('TableDataModel').getObject();  
            var ends =Number(oContext.ends);
            var length = Number(oContext.Beamlength);
            var Breaks =Number(oContext.Breaks);
            var a = Breaks * 1000000;
            var b = a /length;
            var c = b  / ends;
            c = c.toFixed(3);
            oEvent.getSource().getBindingContext("TableDataModel").getObject().Breakmilion = c
            
            oBusyDialog.close();
            this.avgbpmm();
            },
            avgbpmm:function(){
                var oTableEmptyRowFoundData = this.getView().getModel("TableDataModel").getProperty("/aTableData");
                var ArrayVarForNetwt = [];
                oTableEmptyRowFoundData.map(function (items) {
                    var var3 = items.Breakmilion;
                    if (var3 != "" ) {
                        var Var33 = parseFloat(var3);
                        ArrayVarForNetwt.push(Var33);

                    }

                })
               var lengthtable= oTableEmptyRowFoundData.length;
               var NetWt = 0;
                var arrayLen3 = ArrayVarForNetwt.length;
                for (var r = 0; r < arrayLen3; r++) {
                    NetWt += ArrayVarForNetwt[r];
                }

                var avgbpmm = NetWt / lengthtable;
                avgbpmm = parseFloat(avgbpmm).toFixed(3);
                var oInputForNetWt = this.getView().byId("AVGBPMM");
                oInputForNetWt.setValue(avgbpmm)



            },
            F4MATDES: function () {
                var oBusyDialog = new sap.m.BusyDialog({
                    text: "Please wait"
                });
                oBusyDialog.open();
                var oInput = this.getView().byId("Setno");

                if (!this._oValueHelpDialog) {
                    this._oValueHelpDialog = new sap.ui.comp.valuehelpdialog.ValueHelpDialog("ZfsetNo", {
                        supportMultiselect: false,
                        supportRangesOnly: false,
                        stretch: sap.ui.Device.system.phone,
                        keys: "ZfsetNo",
                        descriptionKey: "Set No",
                        filtermode: "true",
                        enableBasicSearch: "true",
                        ok: function (oEvent) {
                            var valueset = oEvent.mParameters.tokens[0].mAggregations.customData[0].mProperties.value.ZfsetNo;
                            oInput.setValue(valueset);
                            this.close();
                        },
                        cancel: function () {
                            this.close();
                        }
                    });
                }


                var oFilterBar = new sap.ui.comp.filterbar.FilterBar({
                    advancedMode: true,
                    filterBarExpanded: false,
                    filterBarExpanded: true,
                    enableBasicSearch: true,
                    showGoOnFB: !sap.ui.Device.system.phone,
                    filterGroupItems: [new sap.ui.comp.filterbar.FilterGroupItem({ groupTitle: "foo", groupName: "gn1", name: "n1", label: "Set No", control: new sap.m.Input() })],




                    search: function (oEvt) {
                        oBusyDialog.open();
                        //  var oParams = oEvt.getParameter("YY1_PACKINGTYPE");
                        var ZfsetNo = oEvt.mParameters.selectionSet[0].mProperties.value;
                        // if no  values 
                        if (ZfsetNo === "") {
                            oTable.bindRows({
                                path: "/Warping_Entry"
                            });
                        }

                        //  if  select values  
                        else {
                            oTable.bindRows({
                                path: "/Warping_Entry", filters: [
                                    new sap.ui.model.Filter("ZfsetNo", sap.ui.model.FilterOperator.EQ, ZfsetNo)]
                            });
                        }
                        oBusyDialog.close();
                    }
                });

                this._oValueHelpDialog.setFilterBar(oFilterBar);
                var oColModel = new sap.ui.model.json.JSONModel();
                oColModel.setData({
                    cols: [
                        { label: "Set No", template: "ZfsetNo" }
                    ]
                });
                var oTable = this._oValueHelpDialog.getTable();
                oTable.setModel(oColModel, "columns");
                var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZPP_WARPING_ENTRY_BIN");
                oTable.setModel(oModel);
                oBusyDialog.close();
                this._oValueHelpDialog.open();

            },
            onBack: function () {
                var sPreviousHash = History.getInstance().getPreviousHash();
                if (sPreviousHash !== undefined) {
                    window.history.go(-1);
                } else {
                    this.getOwnerComponent().getRouter().navTo("page1", null, true);
                }
            }
        });
    });
