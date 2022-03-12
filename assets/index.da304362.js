import{_ as t}from"./OperationButtons.d62792c7.js";import{T as e,_ as a,a5 as n,m as r,r as i,l as o,o as s}from"./vendor.e77115a4.js";const d={name:"FXRateDataTable",components:{NDataTable:e,NDatePicker:a,NInputNumber:n,OperationButtons:t},setup:()=>({pagination:{pageSize:10}}),computed:{data(){return this.$store.state.fxrate.data},columns(){var e=this.$store;return[{title:"日期",key:"date",render:t=>r(a,{value:Date.parse(t.date),type:"date",disabled:!t.edit,"on-update:value":a=>{var n=new Date(a);n.setTime(a-60*n.getTimezoneOffset()*1e3),e.commit("fxrate/edit",{id:t.id,field:"date",value:n.toISOString().split("T")[0]})}})},{title:"汇率",key:"rate",render:t=>r(n,{value:t.rate,disabled:!t.edit,"show-button":!1,"on-update:value":a=>{e.commit("fxrate/edit",{id:t.id,field:"rate",value:a})}})},{title:"操作",key:"edit",width:400,render:e=>r(t,{record:e,table:"fxrate"})}]}}};d.render=function(t,e,a,n,r,d){const l=i("n-data-table");return s(),o(l,{bordered:!1,columns:d.columns,data:d.data,pagination:n.pagination,size:"small"},null,8,["columns","data","pagination"])};const l={name:"FXRate",components:{FXRateDataTable:d},mounted(){0==this.$store.state.fxrate.data.length&&this.$store.dispatch("fxrate/getData")}};l.render=function(t,e,a,n,r,d){const l=i("FXRateDataTable");return s(),o(l)};export{l as default};
