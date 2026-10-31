<?php

namespace Tests\Feature;

use App\Providers\AppServiceProvider;
use Illuminate\Support\Facades\URL;
use Tests\TestCase;

class DeploymentConfigTest extends TestCase
{
    public function test_production_https_url_is_preserved_behind_an_http_proxy(): void
    {
        $this->app->instance('env', 'production');
        config(['app.url' => 'https://seapedia-api.onrender.com']);
        (new AppServiceProvider($this->app))->boot();

        $this->assertStringStartsWith('https://', URL::to('/api/products'));
        $this->get('/up')->assertOk();
    }
}
