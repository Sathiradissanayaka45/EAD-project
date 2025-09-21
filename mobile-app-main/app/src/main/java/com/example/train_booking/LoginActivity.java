package com.example.train_booking;

import static android.content.ContentValues.TAG;
import androidx.appcompat.app.AppCompatActivity;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.content.Intent;
import android.preference.PreferenceManager;
import android.util.Log;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
import com.auth0.android.jwt.JWT;
import org.json.JSONException;
import org.json.JSONObject;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

/*
    LOGIN ACTIVITY - Handle the login functionality for Users
 */

public class LoginActivity extends AppCompatActivity {

    //Initialize Layout
    TextView txtSignUp;
    EditText email;
    EditText password;
    Button btnSignIn;

    private final String url = "http://10.0.2.2:5101/api/auth/login";

    //Local Storage - [REF] - https://code.tutsplus.com/android-from-scratch-how-to-store-application-data-locally--cms-26853t
    SharedPreferences myPreferences;
    SharedPreferences.Editor myEditor;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        try
        {
            this.getSupportActionBar().hide();
        }
        catch (NullPointerException e){}
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        myPreferences = PreferenceManager.getDefaultSharedPreferences(LoginActivity.this);
        myEditor = myPreferences.edit();

        txtSignUp = findViewById(R.id.txtSignUp);
        email = findViewById(R.id.edtSignInEmail);
        password = findViewById(R.id.edtSignInPassword);
        btnSignIn = findViewById(R.id.btnSignIn);

        txtSignUp.setOnClickListener(view -> {
            Intent intent = new Intent(LoginActivity.this, SignUpActivity.class);
            startActivity(intent);
            finish();
        });
//Set onClick for the Button
        btnSignIn.setOnClickListener(view -> {
            if(email.getText().toString().isEmpty() || password.getText().toString().isEmpty()) {
                Toast.makeText(getApplicationContext(),  "Please fill all the required fields.", Toast.LENGTH_LONG).show();
            } else {
                loginUser();
            }
        });
    }
//Login Method
    private void loginUser( ){
        try {
            //RequestQueue initialized;
            RequestQueue mRequestQueue = Volley.newRequestQueue(this);

            // Define payload
            JSONObject jsonBody = new JSONObject();
            jsonBody.put("nic", email.getText().toString());
            jsonBody.put("email", email.getText().toString());
            jsonBody.put("password", password.getText().toString());

            System.out.println(jsonBody);

            // Create a JsonObjectRequest with POST method, URL, JSON object, and response/error listeners
            JsonObjectRequest jsonObjectRequest = new JsonObjectRequest(Request.Method.POST, url, jsonBody,
                    response -> {
                        // Handle the response here
                        try {
                            //store token to the local storage
                            myEditor.putString("accessToken", (String) response.get("accessToken"));
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }

                        try {
                            //[REF] - https://github.com/auth0/JWTDecode.Android
                            JWT jwt = new JWT((String) response.get("accessToken"));

                            String id = jwt.getClaim("id").asString(); //get custom claims
                            String nic = jwt.getClaim("nic").asString(); //get custom claims
                            String username = jwt.getClaim("username").asString(); //get custom claims
                            String email = jwt.getClaim("email").asString(); //get custom claims
                            String phone = jwt.getClaim("phone").asString(); //get custom claims
                            String address = jwt.getClaim("address").asString(); //get custom claims

                            myEditor.putString("id", id);
                            myEditor.putString("nic", nic);
                            myEditor.putString("username", username);
                            myEditor.putString("email", email);
                            myEditor.putString("phone", phone);
                            myEditor.putString("address", address);

                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                        myEditor.commit();

                        //set toast and navigate to Dashboard
                        Toast.makeText(getApplicationContext(),  "You are successfully logged in!", Toast.LENGTH_LONG).show();
                        Intent intent = new Intent(LoginActivity.this,Dashboard.class);
                        startActivity(intent);
                    },
                    error -> {

                        // Handle errors here
                        if (error.networkResponse != null) {
                            Log.e(TAG, "Error Response code: " + error.networkResponse.statusCode);
                            String responseBody = new String(error.networkResponse.data, StandardCharsets.UTF_8);
                            Log.e(TAG, "Error Response body: " + responseBody);
                            Toast.makeText(getApplicationContext(), responseBody, Toast.LENGTH_LONG).show();
                        }

                    }) {
                @Override
                public Map<String, String> getHeaders() {
                    // Define your custom headers here
                    Map<String, String> headers = new HashMap<>();
                    headers.put("Access-Control-Allow-Origin", "*");
                    headers.put("Content-Type", "application/json");
                    return headers;
                }
            };

            // Add the request to the RequestQueue
            mRequestQueue.add(jsonObjectRequest);

        } catch (JSONException e) {
            e.printStackTrace();
        }
    }
}
