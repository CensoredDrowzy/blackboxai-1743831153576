using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Threading.Tasks;

namespace MiniRoyaleCheat.WebAPI
{
    public class Startup
    {
        private Aimbot _aimbot;
        private ESPManager _esp;

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseRouting();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapGet("/", async context =>
                {
                    await context.Response.WriteAsync("Mini Royale Cheat API");
                });
            });
        }

        public void Start()
        {
            var host = new WebHostBuilder()
                .UseKestrel()
                .UseUrls("http://localhost:8000")
                .UseStartup<Startup>()
                .Build();

            host.RunAsync(); // Run in background
        }

        public void InjectDependencies(Aimbot aimbot, ESPManager esp)
        {
            _aimbot = aimbot;
            _esp = esp;
        }
    }
}