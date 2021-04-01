exports.handler = async (event, context) => {
  console.log(event, context);

  const body = JSON.parse(event.body || '{}');

  return {
    statusCode: 200,
    body: JSON.stringify({ challenge: body.challenge })
  };
};
