var calendarClass = 'col-lg-3 col-md-3 col-sm-4 col-xs-12';
var oneWeekInMilliseconds = 604800000;
var twoWeeksInMilliseconds = 1209600000;
var offFridayBase = new Date('01 Jan 2016');
var inverseFridays = false;
var currentYear;

jQuery(document).ready(function()
{
   var today = new Date();
   var currentYear = today.getFullYear();
   jQuery('#selectedYear').val(currentYear);
   generateOffFridays(currentYear);
   
   jQuery('#calculate').click(function(){
      var selectedYear = jQuery('#year').val();
      generateOffFridays(selectedYear);
   });
   
   jQuery('#inverse').click(function(){
      inverseFridays = !inverseFridays;
      offFridayBase = new Date(offFridayBase.getTime());
      
      if (inverseFridays)
      {        
         offFridayBase.setDate(offFridayBase.getDate() + 7); 
      }
      else
      {
         offFridayBase.setDate(offFridayBase.getDate() - 7); 
      }
      
      var selectedYear = jQuery('#selectedYear').val();
      generateOffFridays(selectedYear);
   });
   
   
   jQuery('#decrementYear').click(function(e){
      e.preventDefault();
      
      var selectedYear = parseInt(jQuery('#selectedYear').val()) - 1;
      jQuery('#selectedYear').val(selectedYear);
      
      generateOffFridays(selectedYear);  
      
      if (selectedYear > currentYear){
         jQuery('#decrementYear').prop('disabled', false);
      }      
      else{
         jQuery('#decrementYear').prop('disabled', true);
      }
   });
   
   jQuery('#incrementYear').click(function(e){
      e.preventDefault();
      
      var selectedYear = parseInt(jQuery('#selectedYear').val()) + 1;
      jQuery('#selectedYear').val(selectedYear);
      
      generateOffFridays(selectedYear);
      
      if (selectedYear > currentYear){
         jQuery('#decrementYear').prop('disabled', false);
      }
   });
});

function generateOffFridays(year)
{
   // For each month of the year
   for (var month = 0; month < 12; month++)
   {
      var firstOfMonth = new Date(year, month, '01');
      var fridayInMonth = getFriday(firstOfMonth);
      var dateArray = [];
      var fridayIsInCurrentMonth = true;
      
      while (fridayIsInCurrentMonth == true)
      {
         if (fridayInMonth.getMonth() == month)
         {
            var fridayTimezoneOffset = fridayInMonth.getTimezoneOffset();
            var baseTimezoneOffset = offFridayBase.getTimezoneOffset();
            var timezoneDifference = (fridayTimezoneOffset != baseTimezoneOffset);
            var difference = fridayInMonth.getTime() - offFridayBase.getTime() + (baseTimezoneOffset - fridayTimezoneOffset) * 60000;
            var remainder = difference % twoWeeksInMilliseconds;
            // An off Friday
            if (remainder == 0){
               dateArray.push(fridayInMonth);
               fridayIsInCurrentMonth = true;
            }
         }
         else
         {
            fridayIsInCurrentMonth = false;
         }

         fridayInMonth = new Date(fridayInMonth.getTime());
         fridayInMonth.setDate(fridayInMonth.getDate() + 7);
      }
      
      var date = {year: year, month: month};
      
      jQuery('#calendar' + month).addClass(calendarClass);
      
      jQuery('#calendar' + month).datepicker({
         defaultViewDate: firstOfMonth,
         multidate: true,
         keyboardNavigation: false,
         disableTouchKeyboard: true,
         daysOfWeekDisabled: [0,1,2,3,4,5,6],
         maxViewMode: 0
      });
      
      jQuery('#calendar' + month).datepicker('setDates', dateArray);
   }
}

function getFriday(date)
{
   var resultDate = new Date(date.getTime());
   resultDate.setDate(date.getDate() + (12 - date.getDay()) % 7);
   resultDate.setHours(0);
   
   return resultDate;
}