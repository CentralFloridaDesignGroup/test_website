$(document).ready(function () {

  maxStep = $(".step").length - 1;

  $.getJSON('https://centralfloridadesigngroup.github.io/atwell-fla-resources/xml/florida_drones.json', (data) => {
    // JSON result in `data` variable
    // console.debug(data);
    droneData = data;
    data.Drones.forEach(element => {
      // console.debug(element.id);
      $('#drone_Name').append($('<option>', {
        value: element.id,
        text: element.manufacturer + " " + element.model
      }));
    });
    $("#drone_Name").trigger("change");
  });

  $("#drone_Name").on("change", () => {
    var idx = $("#drone_Name").prop('selectedIndex');
    // console.debug(droneData.Drones[idx].id);
    $("#drone_id").val(droneData.Drones[idx].id)
  })

  $("#form-next").on('click', () => {
    changeSlide(1);
  });

  $("#form-previous").on('click', () => {
    changeSlide(-1);
  });

});

const { PDFDocument } = PDFLib
var droneData;
var currentStep = 0;
var maxStep = 5;


async function FillFormDebug() {

  console.log("Starting");
  const formUrl = "Atwell-drone-Flight-record.pdf";
  const formPdfBytes = await fetch(formUrl).then(res => res.arrayBuffer());

  const pdfDoc = await PDFDocument.load(formPdfBytes);
  const form = pdfDoc.getForm();

  const fields = form.getFields();
  fields.forEach(field => {
    const type = field.constructor.name
    const name = field.getName()
    console.log(`${type}: ${name}`)
  })
}

async function FillForm() {
  const d = new Date();
  var month = d.getUTCMonth().toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false  });
  const reportDate = `${d.getUTCFullYear() % 100}${(month)}${d.getUTCDate()}-${d.getUTCHours()}${d.getUTCMinutes()}${d.getUTCSeconds()}`;

  console.log("Starting");
  const formUrl = "Atwell-drone-Flight-record.pdf";
  const formPdfBytes = await fetch(formUrl).then(res => res.arrayBuffer());

  const pdfDoc = await PDFDocument.load(formPdfBytes);
  const form = pdfDoc.getForm();

  // Report Info
  form.getTextField("Report_ID").setText(reportDate);
  form.getTextField("Report_ID").enableReadOnly();
  // General Information

  form.getTextField("Job_Number").setText($("#job_number").val());
  form.getTextField("Flight_Number").setText($("#flight_number").val());
  form.getTextField("Project_Area").setText($("#project_area").val());
  form.getTextField("Drone_ID").setText($("#drone_id").val());
  form.getTextField("Battery_ID").setText($("#drone_battery").val());
  form.getRadioGroup("Flight_Type").select($("#flight_type").val());
  $("input[type='checkbox']").each(function() {
    // console.debug($(this));
    if ($(this).is(":checked")){
      form.getCheckBox(`Exception_107_${$(this).val()}`).check();
    }
  });

  /* const jobNumber = form.getTextField("Job_Number");
  jobNumber.setText("123456789"); */

  // var fileDate = $("#file-date").val().split("-");
  // console.log(fileDate);

  // form.getTextField("File_Date").setText(fileDate[2]);
  // form.getTextField("File_Year").setText(fileDate[0].substring(2));
  // form.getDropdown("File_Month").select(getMonthName(fileDate[1]));
  // console.log(form.getDropdown("File_Month").getSelected() + " " + form.getTextField("File_Date").getText() + ", 20" + form.getTextField("File_Year").getText());

  // form.getTextField("Filer_Signature").setText("/s/" + getFilerName());
  // form.getTextField("File_Name").setText(getFilerName());
  form.getCheckBox("Filled_Online").check();

  // Save and download
  const pdfBytes = await pdfDoc.save();
  const fileName = `Drone Flight Log - ${reportDate}.pdf`
  // console.debug(`File name: ${fileName}`)
  download(pdfBytes, fileName, "application/pdf");
}

function getMonthName(monthNumber) {
  const date = new Date();
  date.setMonth(monthNumber - 1);

  return date.toLocaleString('en-US', { month: 'long' });
}

function getMonthFromString(mon){
  return new Date(Date.parse(mon +" 1, 2012")).getMonth()+1
}

function getFilerName() {
  return $("#filer_first-name").val() + " " + $("#Filer_last-name").val();
}

function updateProgress() {
  var progressValue = currentStep / maxStep * 100;

  $("#progress").css({ "width": progressValue + "%" });
};

function changeSlide(increment) {
  var nextStep = currentStep + increment;
  // console.debug("current: " + currentStep + " | Max: " + maxStep + " | Next index: " + nextStep);
  var steps = $(".step");
  steps.eq(currentStep).slideToggle();
  steps.eq(nextStep).slideToggle();
  currentStep = nextStep;

  if (currentStep == maxStep) {
    $("#form-next").addClass("d-none");
    $("#form-submit").removeClass("d-none");
  } else {
    $("#form-next").removeClass("d-none");
    $("#form-submit").addClass("d-none");
  };
  if (currentStep == 0) {
    $("#form-previous").addClass("d-none");
  } else {
    $("#form-previous").removeClass("d-none");
  };
  updateProgress();
}