// package com.lenzoa.app;

// import com.getcapacitor.BridgeActivity;

// public class MainActivity extends BridgeActivity {}

package com.lenzoa.app;

import android.os.Bundle;
import android.webkit.CookieManager;
import android.webkit.WebSettings;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    
    // Configure cookies for Better Auth
    CookieManager cookieManager = CookieManager.getInstance();
    cookieManager.setAcceptCookie(true);
    cookieManager.setAcceptThirdPartyCookies(this.bridge.getWebView(), true);
    
    // Configure WebView settings
    WebSettings webSettings = this.bridge.getWebView().getSettings();
    webSettings.setDomStorageEnabled(true);
    webSettings.setDatabaseEnabled(true);
    
    // Flush cookies to ensure persistence
    cookieManager.flush();
  }
}