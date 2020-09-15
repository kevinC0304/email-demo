using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http.Headers;
using System.Net.Mail;
using System.Threading.Tasks;
using System.Web;
using HtmlAgilityPack;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;

namespace service.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class ValuesController : ControllerBase
    {
        [HttpPost("[action]")]
        public IActionResult send([FromBody] email fromdata)
        {
            try
            {
                var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), "Resources");



                using (var message = new MailMessage())
                {
                    if (fromdata.to.Contains(';'))
                    {
                        string[] toArr = fromdata.to.Split(';');
                        foreach (var item in toArr)
                        {
                            message.To.Add(new MailAddress(item.Trim()));

                        }
                    }
                    else if (fromdata.to != "")
                    {
                        message.To.Add(new MailAddress(fromdata.to.Trim()));
                    }


                    if (fromdata.cc.Contains(';'))
                    {
                        string[] ccArr = fromdata.cc.Split(';');
                        foreach (var item in ccArr)
                        {
                            message.CC.Add(new MailAddress(item.Trim()));
                        }
                    }
                    else if(fromdata.cc!="")
                    {
                        message.CC.Add(new MailAddress(fromdata.cc.Trim()));
                    }

                    if (fromdata.bcc.Contains(';'))
                    {
                        string[] bccArr = fromdata.bcc.Split(';');
                        foreach (var item in bccArr)
                        {
                            message.Bcc.Add(new MailAddress(item.Trim()));
                        }
                    }
                    else if (fromdata.bcc != "")
                    {
                        message.Bcc.Add(new MailAddress(fromdata.bcc.Trim()));
                    }

                    message.From = new MailAddress("sender@test.com", "test sender");
                    message.ReplyTo = new MailAddress("sender@test.com", "test sender");
                    message.Subject =fromdata.subject;


                    HtmlDocument doc = new HtmlDocument();
                    doc.LoadHtml(fromdata.body);
                    HtmlNode node = doc.DocumentNode;
                    HtmlNodeCollection imgs = node.SelectNodes("//img");
                    if (imgs != null)
                    {
                        foreach (var img in imgs)
                        {
                            var imgSrc = img.Attributes["src"].Value;
                            byte[] buffer = Convert.FromBase64String(imgSrc.Substring(imgSrc.IndexOf(',') + 1));

                            string extension = imgSrc.Substring(imgSrc.IndexOf('/') + 1, imgSrc.IndexOf(';') - imgSrc.IndexOf('/')-1);
                            string imgName = Guid.NewGuid() + "."+ extension;
                            string fileName = Path.Combine(pathToSave, imgName);
                            FileStream fs = new FileStream(fileName, FileMode.Create);
                            fs.Write(buffer, 0, buffer.Length);
                            fs.Dispose();
                            img.Attributes["src"].Value = "cid:" + imgName;
                            Attachment imgAtt = new Attachment(fileName);
                            imgAtt.ContentId = imgName;
                            imgAtt.ContentDisposition.Inline = true;
                            message.Attachments.Add(imgAtt);
                        }
                        fromdata.body = node.OuterHtml;
                    }


                    message.Body = fromdata.body;
                    message.IsBodyHtml = true;
                    
                    foreach (var filename in fromdata.attachments)
                    {
                        var fullPath = Path.Combine(pathToSave, filename);
                        message.Attachments.Add(new Attachment(fullPath));

                    }
                    using (var client = new SmtpClient("smtp.gmail.com"))
                    {
                        client.Port = 587;
                        
                        client.Credentials = new NetworkCredential("", "");
                        client.EnableSsl = true;
                        client.Send(message);
                    }
                }

                return Ok();
   
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }
        [HttpPost("[action]")]
        public IActionResult Upload()
        {
            try
            {

                var filecount = Request.Form.Files.Count;
                var file = Request.Form.Files[0];

                var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), "Resources");
                if (file.Length > 0)
                {
                    var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                    var fullPath = Path.Combine(pathToSave, fileName);
        
                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        file.CopyTo(stream);
                    }
                    return Ok();
                }
                else
                {
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }

        [HttpGet("[action]")]
        public IActionResult Download([FromQuery] string file)
        {
            var uploads = Path.Combine(Directory.GetCurrentDirectory(), "Resources");
            var filePath = Path.Combine(uploads, file);
            if (!System.IO.File.Exists(filePath))
                return NotFound();
            var memory = new MemoryStream();
            using (var stream = new FileStream(filePath, FileMode.Open))
            {
                 stream.CopyTo(memory);
            }
            memory.Position = 0;

            return File(memory, GetContentType(filePath), file);
        }

        private string GetContentType(string path)
        {
            var provider = new FileExtensionContentTypeProvider();
            string contentType;
            if (!provider.TryGetContentType(path, out contentType))
            {
                contentType = "application/octet-stream";
            }
            return contentType;
        }

    }


    public class email
    {
        public string to { get; set; }
        public string cc { get; set; }
        public string bcc { get; set; }
        public string subject { get; set; }
        public string body { get; set; }
        public string[] attachments { get; set; }

    }
}
