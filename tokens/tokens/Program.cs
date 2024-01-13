using Google.Apis.Auth.OAuth2;
using Google.Apis.Util.Store;

public class Program
{
    static string[] Scopes = { "" };
    static string ApplicationName = "";

    [Obsolete]
    public static void Main(string[] args)
    {
        // Замените эти значения на ваши реальные данные
        string clientId = "";
        string clientSecret = "";

        var clientSecrets = new ClientSecrets()
        {
            ClientId = clientId,
            ClientSecret = clientSecret
        };

        UserCredential credential;

        string credPath = Path.Combine(Directory.GetCurrentDirectory(), "token.json");

        credential = GoogleWebAuthorizationBroker.AuthorizeAsync(
            clientSecrets,
            Scopes,
            "user",
            CancellationToken.None,
            new FileDataStore(credPath, true)).Result;

        Console.WriteLine("Credential file saved to: " + credPath);
    }
}
