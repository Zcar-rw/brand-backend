import dotenv from 'dotenv';
const { APP_URL_FRONTEND } = process.env
export default (car) => {
  const subject = `${car.name} has been published`;
  const message = `<div style="margin-top: 20px">Hello, ${car.owner.firstName}!</div>
  <div style="margin-bottom: 20px">Your car has been published online, soon you will start receiving bookings!</div>
  <div style="border: 1px solid #cdcdcd;border-radius:6px;margin: 10px 0 20px 0">
  <img src='https://res.cloudinary.com/ninjas/image/upload/${car.photo}' alt="Locar"  style="width:100%;height:auto;display:block;margin:0 auto;border-radius:6px" />
  <div style="padding: 15px;border-top:1px solid #cdcdcd">
  <h4>${car.name}</h4>
  <div>${car.plateNumber} | VIN: ${car.VIN}</div>
  </div>
  <div style="padding:15px 15px 40px 15px;">
  <a href='${APP_URL_FRONTEND}/car/${car.slug}' style="margin:15px 0;padding:15px 35px;background:#0073ff;color:#ffffff;clear:both;border-radius:3px;text-decoration:none">View online</a>
  </div>
  </div>`;
  return { message, subject };
};
