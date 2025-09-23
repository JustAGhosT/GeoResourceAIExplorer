import appInsights from 'applicationinsights';
const conn = process.env.APPLICATIONINSIGHTS_CONNECTION_STRING || process.env.APPINSIGHTS_CONNECTIONSTRING;
if (conn && !appInsights.defaultClient) {
  appInsights.setup(conn).setAutoCollectConsole(true).setSendLiveMetrics(true).start();
}
