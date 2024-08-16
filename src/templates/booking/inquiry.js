export default (data) => {
  const subject = `Complete your car rental booking`
  const message = `<h2 style="margin: 0 !important; padding: 0">${data.user.user.firstName}, complete your car rental booking!</h2>
<div
  style="border: 1px solid #cdcdcd; border-radius: 6px; margin: 10px 0 20px 0"
>
  <img
    src="https://res.cloudinary.com/ninjas/image/upload/${data.car.photo}"
    alt="Locar"
    style="
      width: 100%;
      height: auto;
      display: block;
      margin: 0 auto;
      border-radius: 6px;
    "
  />
  <div style="padding: 15px; border-top: 1px solid #cdcdcd">
    <h4>${data.car.name}</h4>
    <div>${data.car.transmission} | ${data.car.transmission}</div>
  </div>
</div>
<h4 style="margin-bottom:0!important">Rental details</h4>
<table
  cellspacing="0"
  cellpadding="0"
  style="border: 1px solid #cccccc; width: 100%; border-radius: 3px"
>
  <tr>
    <td style="padding: 15px">Collection date and time</td>
    <td style="padding: 15px; text-align: right"> ${data.startDate}</td>
  </tr>
  <tr>
    <td style="padding: 15px; border-top: 1px solid #cccccc">
      Return date and time
    </td>
    <td style="padding: 15px; border-top: 1px solid #cccccc; text-align: right">
    ${data.endDate}
    </td>
  </tr>
  <tr>
    <td style="padding: 15px; border-top: 1px solid #cccccc">Car</td>
    <td style="padding: 15px; border-top: 1px solid #cccccc; text-align: right">
    ${data.car.name}
    </td>
  </tr>
</table>

<h4 style="margin-bottom:0!important">Price details</h4>
<table
  cellspacing="0"
  cellpadding="0"
  style="border: 1px solid #cccccc; width: 100%; border-radius: 3px"
>
  <tr>
    <td style="padding: 15px">Rental fees</td>
    <td style="padding: 15px; text-align: right">Rwf${data.rentalFees}</td>
  </tr>
  <tr>
    <td style="padding: 15px; border-top: 1px solid #cccccc">Driver fees</td>
    <td style="padding: 15px; border-top: 1px solid #cccccc; text-align: right">
      Rwf${data.driverFees}
    </td>
  </tr>
  <tr style="background: #e9fbfc; font-weight: bold">
    <td style="padding: 15px; border-top: 1px solid #cccccc">Total</td>
    <td style="padding: 15px; border-top: 1px solid #cccccc; text-align: right">
      Rwf${data.amount}
    </td>
  </tr>
</table>
<div style="margin: 20px 0;padding: 15px 0">
<a
  href="/car/slug"
  style="
    margin: 15px 0;
    padding: 15px 35px;
    background: #0073ff;
    color: #ffffff;
    clear: both;
    border-radius: 3px;
    text-decoration: none;
  "
  >Proceed to Payment</a
>
</div>`
  return { message, subject }
}
