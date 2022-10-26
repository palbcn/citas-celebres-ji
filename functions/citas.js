
import citas from "../citas.json";

const DAYMS = 24 * 60 * 60 * 1000;   // 24 hours in milliseconds

export async function handler(event, context) {
  let daynum = Math.floor(Date.now() / DAYMS);
  let wantRandom = event.queryStringParameters.random;  // is "random" in the query parameters

  let todayidx = wantRandom ? 
    Math.floor(Math.random() * citas.length) : 
    daynum % citas.length;  // una cita al día
  let todaycitatxt = citas[todayidx];
  let [_, cita, autor] = /(.*)\((.*)\)$/.exec(todaycitatxt);  
  
  let accept = event.headers?.accept ?? "text/html";
  
  if (accept.includes("application/json")) { 
      let responsejson = {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          cita,
          autor,
          meta: {
            src: "PA for JI",
            at: todayidx,
            for: wantRandom ? "a random day" : "today"
          }
        })
      }     
  
  } else { 
      let citahtml = `<h1>"${cita}"</h1><h2>-- ${autor}`;
      let responsehtml = {
        statusCode: 200,
        headers: {
          "Content-Type": "text/html; charset=utf-8"
        },
        body: citahtml
      }
      return responsehtml;
  }

}
