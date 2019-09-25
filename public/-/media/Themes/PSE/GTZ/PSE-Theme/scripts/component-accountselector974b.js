$("#ddlAccounts").change(function() {	
   $.ajax({
      url: "/api/sitecore/TestAccountSelector/GetAccountDetails", 
      type: "POST",
      data: {contractAccountNumber: $('#ddlAccounts').val()},
       success: function (data) {		
         window.location.href = data.url;
       }
  });
}); 

$("#Confirmenrollsubmit").click(function () {        
        $.ajax({
            url: "/api/sitecore/BudgetBilling/EnrollConfirm",
            type: "POST",
            success: function (data) {
                if (data.url != "")
                    window.location.href = data.url;
            },
            error: function (data) {
                console.log("error in enroll", data.url);
            }
        });
});

$("#ConfirmUnEnrollsubmit").click(function () {        
        $.ajax({
            url: "/api/sitecore/BudgetBilling/UNEnrollConfirm",
            type: "POST",
            success: function (data) {
                if (data.url != "")
                    window.location.href = data.url;
            },
            error: function (data) {
                console.log("error in UnEnroll", data.url);
            }
        });
});


		
		