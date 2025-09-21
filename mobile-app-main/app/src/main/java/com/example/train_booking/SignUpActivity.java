package com.example.train_booking;

import androidx.appcompat.app.AppCompatActivity;
import android.os.Bundle;
import android.content.Intent;
import android.util.Log;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;
import static android.content.ContentValues.TAG;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
import com.google.android.material.textfield.TextInputEditText;
import org.json.JSONException;
import org.json.JSONObject;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

/*
    REGISTER ACTIVITY - Handle the register functionality for Users
 */

public class SignUpActivity extends AppCompatActivity {

    //Initialize Layout
    TextView txtSignIn;
    TextInputEditText nic;
    TextInputEditText username;
    TextInputEditText email;
    TextInputEditText password;
    TextInputEditText phone;
    TextInputEditText address;
    Button btnSignUp;

    //Volley API Request - SAMPLE -
//    private RequestQueue mRequestQueue;
//    private StringRequest mStringRequest;
//    private String url = "https://run.mocky.io/v3/85cf9aaf-aa4f-41bf-b10c-308f032f7ccc";

    private final String url = "http://10.0.2.2:5101/api/auth/register";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        try
        {
            this.getSupportActionBar().hide();
        }
        catch (NullPointerException e){}
        super.onCreate(savedInstanceState);

        setContentView(R.layout.activity_sign_up);

        txtSignIn = findViewById(R.id.txtSignIn);
        nic = findViewById(R.id.edtSignUpNIC);
        username = findViewById(R.id.edtSignUpFullName);
        email = findViewById(R.id.edtSignUpEmail);
        password = findViewById(R.id.edtSignUpPassword);
        phone = findViewById(R.id.edtSignUpMobile);
        address = findViewById(R.id.edtSignUpAddress);
        btnSignUp = findViewById(R.id.btnSignUp);
//Button onClick listner
        txtSignIn.setOnClickListener(view -> {
            Intent intent = new Intent(SignUpActivity.this,LoginActivity.class);
            startActivity(intent);
        });

        btnSignUp.setOnClickListener(view -> {
            if(nic.getText().toString().isEmpty() || username.getText().toString().isEmpty() || email.getText().toString().isEmpty() || password.getText().toString().isEmpty() || phone.getText().toString().isEmpty() || address.getText().toString().isEmpty()){
                Toast.makeText(getApplicationContext(),  "Please fill all the required fields.", Toast.LENGTH_LONG).show();
            } else registerUser();
        });
    }
//Register Method
    private void registerUser( ){
        try {
            //RequestQueue initialized;
            RequestQueue mRequestQueue = Volley.newRequestQueue(this);

            // Define payload
            JSONObject jsonBody = new JSONObject();
            jsonBody.put("nic", nic.getText().toString());
            jsonBody.put("username", username.getText().toString());
            jsonBody.put("email", email.getText().toString());
            jsonBody.put("password", password.getText().toString());
            jsonBody.put("phone", phone.getText().toString());
            jsonBody.put("address", address.getText().toString());
            jsonBody.put("type", "user");
            jsonBody.put("status", "ACTIVE");

            System.out.println(jsonBody);

            // Create a JsonObjectRequest with POST method, URL, JSON object, and response/error listeners
            JsonObjectRequest jsonObjectRequest = new JsonObjectRequest(Request.Method.POST, url, jsonBody,
                    response -> {
                        // Handle the response here
                        Toast.makeText(getApplicationContext(),  "You are successfully registered!", Toast.LENGTH_LONG).show();
                        Intent intent = new Intent(SignUpActivity.this,LoginActivity.class);
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
