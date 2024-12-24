sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,MessageBox,UIComponent,JSONModel) {
        "use strict";

        return Controller.extend("WarpingEntry.zppwarpingentry.controller.View1", {
            onInit: function () {
                 
                this.getOwnerComponent().setModel(new JSONModel(), "oCommonModel");  
            },
            _onRouteMatch: function (oEvent) {

            },
            NextView: function () {
               
                var oCommonModel = this.getOwnerComponent().getModel('oCommonModel');
                var Radio = this.byId("idActionRadioBtnGroup").getSelectedButton().getText();
                var setno = this.getView().byId("Setno").getValue();
                var oDisplay = {
                    SetNo: setno,
                    Action: Radio,
                };
                oCommonModel.setProperty('/displayObject', oDisplay);
                
               
                if (Radio === "Create") {
                    this.setnocheck();
                    
                }else if (Radio === "Change") {
                    this.setnocheck1();
                    // UIComponent.getRouterFor(this).navTo("warping");
                }
            },
            setnocheck:function(){
                var oModel = this.getView().getModel();
                var setno = this.getView().byId("Setno").getValue();
                var oFilter1 = new sap.ui.model.Filter("ZfsetNo", "EQ", setno);
                      oModel.read("/Set_No_Cheack", {
                        filters: [oFilter1],
                        success: function (oresponse) {
                            if(oresponse.results.length === 0){
                                UIComponent.getRouterFor(this).navTo("warping");
                            }
                            else if (oresponse.results[0].ZfsetNo === setno) {
                                MessageBox.error("Wrong Set No Is already");
                            }
                            
                        }.bind(this),
                        error: function(results){
                            MessageBox.error(" Wrong Set No Input ");

                        }
                    })
            
                

            },
            setnocheck1:function(){
                var oModel = this.getView().getModel();
                var setno = this.getView().byId("Setno").getValue();
                var oFilter1 = new sap.ui.model.Filter("ZfsetNo", "EQ", setno);
                      oModel.read("/Set_No_Cheack", {
                        filters: [oFilter1],
                        success: function (oresponse) {
                            if(oresponse.results.length === 0){
                                MessageBox.error("Wrong Set No is not Created ");
                                
                            }
                            else if (oresponse.results[0].ZfsetNo === setno) {
                                UIComponent.getRouterFor(this).navTo("warping");
                            }
                            
                        }.bind(this),
                        error: function(results){
                            MessageBox.error(" Wrong Set No Input ");

                        }
                    })
            
                

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
                        if (ZfsetNo === "" ) {
                            oTable.bindRows({
                                path: "/Set_No_F4"
                            });
                        }
          
                        //  if  select values  
                        else {
                            oTable.bindRows({
                                path: "/Set_No_F4", filters: [
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
