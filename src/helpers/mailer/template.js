import dotenv from 'dotenv';
dotenv.config();

const { CONTACT_EMAIL, CONTACT_PHONE } = process.env;

export default (message) => {
  return `<div style="width:100%;padding:5px 0 0 0;font-size:16px;">
      <!--   wrapper -->
      <div style="max-width: 720px;margin:20px auto;background:#ffffff;">
      <!--   header -->
      <div style="background:#CFF7DE;padding:10px 30px 0px;color:#ffffff;text-align:center;font-size:34px;height:70px;margin-top:30px">
        <img src="https://res.cloudinary.com/ninjas/image/upload/v1696251472/reach/logo__b4jbga.png" alt="Reach" width="130" style="height:auto;margin:5px auto;" />
      </div>
      
      <!--   BODY -->
      <div style="padding:20px;margin: 0 auto;display:block;text-align:left;">
        ${message}
      <br><br>
      <div>
      If you have any questions, please call us on ${CONTACT_PHONE}, visit our <a href='http://reach.rw/help-center'>Help Center</a>, or <a href='${CONTACT_EMAIL}'>Send us an email</a>
      </div>
      <br>
      <div>Best regards,<br></div>
      <b>Kale Team</b>
      </div>
      <!-- end body   -->
      </div>
      <!-- FOOTER -->
      <div style="padding:35px 0px;text-align:left;">
        <div style="max-width:720px;margin: 0 auto;">
          <div style="padding: 0 20px">
            Copyright, 2024<br>
            Kale , All right reserved.
          </div>
        </div>
      </div>
  </div>`;
};
