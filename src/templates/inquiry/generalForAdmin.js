export default (data) => {
  const message = `<h3>Contact form</h3><br />
  <div>Hello,</div>
  <div style='border:1px solid #cdcdcd;padding: 15px;border-radius:5px'>${data}</div>
  <div>Team Reach.</div>`
  const subject = `Contact form`
  return { message, subject }
}
