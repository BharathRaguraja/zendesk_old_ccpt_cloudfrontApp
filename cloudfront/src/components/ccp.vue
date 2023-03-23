<template>
  <div class="ccp-container">
    <div id="defaultCCP" ref="containerDiv" style="display:none"/>
    <b-container v-if="loggedin" class="bv-example-row">

      <!-- title bar  -->
      <b-row class="text-center title-bar">

        <b-col cols="3">
            <img class="main-logo" src="../assets/sandeza.png" alt="main-logo">
        </b-col>
        <b-col cols="7">
          <b-dropdown :class="pageUrl == 'call' ? 'makeDisable' : ''" size="lg"  variant="link" toggle-class="text-decoration-none" no-caret>
            <template v-slot:button-content>
              <span class="title-status"> {{ agentStatus }} </span> <font-awesome-icon class="fontIcon" icon="chevron-down" />
            </template>
            <b-dropdown-item v-for="state in agentStates" 
                              :key="state.type"
                              @click="changeStatus(state)">
                              {{state.name}}
            </b-dropdown-item>
          </b-dropdown>
        </b-col>
        <b-col style="padding-top: 10px">
          <font-awesome-icon @click="toggleSettings()" :class="pageUrl == 'call' ? 'fontIcon settingsIcon makeDisable' : 'fontIcon settingsIcon'" icon="cog" size="lg"/>
        </b-col>
      </b-row>

      <!-- settings block -->
      <b-container v-show="pageUrl == 'settings'" class="body-container">

        <p> {{ $t("logged_in_as") }} <strong> {{agentUserName}} </strong></p>

        <b-form-select v-model="languageSelected" :options="languageOptions" value-field="value" size="sm" class="mt-3"></b-form-select>
        
        <b-button pill style="margin-top:30px"  @click="toggleSettings()" > {{ $t("back") }} </b-button>
        <!-- <b-form-group label="Phone Type">
          <b-form-radio-group
            id="select_phone_type"
            v-model="selected_phone_type"
            :options="phoneTypesOption"
            name="radio-options"
          ></b-form-radio-group>
        </b-form-group>
        
        <b-input-group v-if="selected_phone_type == 2">
          <b-input-group-prepend>
            <b-button class="dial-pad-country-code" @click="toggleCountryCodeSettings()" variant="outline-light">
              <span class="flag-icon" v-bind:class="selectedCountrySettings.flag"></span> + {{selectedCountrySettings.code}}
              <font-awesome-icon style="color:#ccc" icon="caret-down" size="sm"/>
            </b-button>
          </b-input-group-prepend>

          <b-form-input class="dial-pad-number" v-model="dialedNumbersettings" type="text"></b-form-input>

          <b-button @click="onSaveDeskPhone()" variant="secondary">
            Save
          </b-button>
        </b-input-group> -->

        <!-- country code block -->
        <!-- <b-container v-if="toggle_country_code_settings && selected_phone_type == 2" class="body-container-content">
          <model-list-select :list="dialableCountries"
                     v-model="selectedCountrySettings"
                     option-value="code"
                     option-text="name">
          </model-list-select>
        </b-container> -->
      </b-container>

      <!-- Dial pad and settings block -->
      <b-container v-show="pageUrl == 'home'" class="body-container">
        <b-input-group>
          <b-input-group-prepend>
            <b-button class="dial-pad-country-code" @click="toggleCountryCode()" variant="outline-light">
              <span class="flag-icon" v-bind:class="selectedCountry.flag"></span> + {{selectedCountry.code}}
              <font-awesome-icon style="color:#ccc" icon="caret-down" size="sm"/>
            </b-button>
          </b-input-group-prepend>

          <b-form-input class="dial-pad-number" v-model="dialedNumber" type="text"></b-form-input>

          
          <b-button class="dial-pad-button" @click="toggleDialPad()" variant="outline-light">
              <font-awesome-icon icon="th" size="lg"/>
          </b-button>
          <b-button class="dial-pad-button" @click="toggleQuickConnects()" variant="outline-light">
              <font-awesome-icon icon="user" size="lg"/>
          </b-button>
          <b-button :disabled="dialedNumber.length >= 10 ? false : true" @click="onDialCall()" variant="secondary">
            <font-awesome-icon style="color:#fff" icon="phone" size="lg"/>
          </b-button>
        </b-input-group>
       
        <!-- country code block -->
        <b-container v-if="homePageUrl == 'countrycode'" class="body-container-content">
          <model-list-select :list="dialableCountries"
                     v-model="selectedCountry"
                     option-value="flag"
                     option-text="name">
          </model-list-select>
          <b-button @click="backToHome()" style="margin-top:10px" pill size="sm">Back</b-button>
        </b-container>
        
        <!-- dialpad block -->
        <b-container v-if="homePageUrl == 'dialpad'" class="body-container-content">
          <div class="button-row">
            <b-button variant="outline-secondary" class="dialpad-button" @click="keyDial('1')">
              <div class="dialpad-number">1</div>
              <span class="dialpad-filler">...</span>
            </b-button>
            <b-button variant="outline-secondary" class="dialpad-button" @click="keyDial('2')">
              <div class="dialpad-number">2</div>
              <span class="dialpad-letters">ABC</span>
            </b-button>
            <b-button variant="outline-secondary" class="dialpad-button" @click="keyDial('3')">
              <div class="dialpad-number">3</div>
              <span class="dialpad-letters">DEF</span>
            </b-button>
          </div>
          <div class="button-row">
            <b-button variant="outline-secondary" class="dialpad-button" @click="keyDial('4')">
              <div class="dialpad-number">4</div>
              <span class="dialpad-letters">GHI</span>
            </b-button>
            <b-button variant="outline-secondary" class="dialpad-button" @click="keyDial('5')">
              <div class="dialpad-number">5</div>
              <span class="dialpad-letters">JKL</span>
            </b-button>
            <b-button variant="outline-secondary" class="dialpad-button" @click="keyDial('6')">
              <div class="dialpad-number">6</div>
              <span class="dialpad-letters">MNO</span>
            </b-button>
          </div>
          <div class="button-row">
            <b-button variant="outline-secondary" class="dialpad-button" @click="keyDial('7')">
              <div class="dialpad-number">7</div>
              <span class="dialpad-letters">PQRS</span>
            </b-button>
            <b-button variant="outline-secondary" class="dialpad-button" @click="keyDial('8')">
              <div class="dialpad-number">8</div>
              <span class="dialpad-letters">TVU</span>
            </b-button>
            <b-button variant="outline-secondary" class="dialpad-button" @click="keyDial('9')">
              <div class="dialpad-number">9</div>
              <span class="dialpad-letters">WXYZ</span>
            </b-button>
          </div>
          <div class="button-row">
            <b-button variant="outline-secondary" class="dialpad-button" @click="keyDial('*')">
              <div class="dialpad-number">*</div>
            </b-button>
            <b-button variant="outline-secondary" class="dialpad-button" @click="keyDial('0')">
              <div class="dialpad-number">0</div>
              <span class="dialpad-letters">+</span>
            </b-button>
            <b-button variant="outline-secondary" class="dialpad-button" @click="keyDial('#')">
              <div class="dialpad-number">#</div>
            </b-button>
          </div>
        </b-container>

        <!---- quick connects -->

        <b-container v-if="homePageUrl == 'quickconnects'" class="body-container-content">
          <div class="quick-connects-head">
            <font-awesome-icon @click="toggleQuickConnects()" class="quick-connects-close-icon" icon="times" size="sm"/>
            <span class="quick-connects-title" > Quick connects </span>
          </div>

          <div class="quick-connects-body">
          <b-row :key= "index" v-for="(contact,index) in quickconnects.filter(quickconnects => quickconnects.type.toLowerCase().includes('phone_number'))"> 
            <b-col cols="9">
              <p class="quick-connects-name">{{ contact.name }} </p>
            </b-col>
            <b-col cols="3" class="text-left">
              <font-awesome-icon class="contact-side-icon" style="color:#ccc;cursor:pointer" @click="onDialCallFromFD(contact.name,contact.phoneNumber)" icon="phone" size="sm"/>
            </b-col>
          </b-row>
          </div>
        </b-container>

          <!-- call history block-->

        <div v-show="homePageUrl == 'calllog'" class="body-container-content">
          <b-tabs 
          content-class="mt-3" 
          fill
          active-nav-item-class="my-nav-active"
          >
            <b-tab @click="contactTabSelected = false">
              <template v-slot:title>
                <font-awesome-icon class="contact-side-icon" icon="phone" size="sm"/> {{ $t("call_logs") }}
              </template>
              <div class="call-logs-list">
                <b-row :key= "index" v-for="(call,index) in call_history.filter(call_history => !dialedNumber || call_history.contactNumber.toLowerCase().includes(dialedNumber.toLowerCase()) || call_history.contactName.toLowerCase().includes(dialedNumber.toLowerCase()))" class="call-history-row">
                  <b-col cols="1">
                    <font-awesome-icon v-if="call.callType == 'Missed'" style="color:#dc3545" icon="level-up-alt" size="lg"/>
                    <font-awesome-icon v-if="call.callType == 'outbound'" style="color:#0d6efd" icon="arrow-up" size="lg"/>
                    <font-awesome-icon v-if="call.callType == 'inbound'" style="color:#198754" icon="arrow-down" size="lg"/>
                  </b-col>
                  <b-col cols="7">
                    <p @click="openContact(call.contactId)" class="call-history-values call-history-values-name" >{{ call.contactName }}</p>
                    <p class="call-history-values call-history-values-number">{{ call.contactNumber }}</p>
                    <p class="call-history-values call-history-values-date">{{ call.calledTime }}</p>
                    </b-col>
                  <b-col cols="3" class="text-left">
                    <font-awesome-icon class="contact-side-icon" style="color:#ccc;cursor:pointer" @click="dialFromHistory(call.contactNumber,call.contactName,call.contactId)" icon="phone" size="sm"/>
                    <font-awesome-icon class="contact-side-icon" v-if="call.contactName == 'Unknown Caller'" style="color:#ccc;cursor:pointer" @click="addContact(call.contactNumber)" icon="user-plus" size="sm"/>
                  </b-col>
                </b-row>
              </div>
            </b-tab>
            <b-tab @click="contactTabSelected = true">
              <template v-slot:title>
                <font-awesome-icon class="contact-side-icon" icon="address-book" size="sm"/> {{ $t("contacts") }}
              </template>
              <div class="call-logs-list">
                <b-row :key= "index" v-for="(call,index) in contacts.filter(contacts => !dialedNumber || contacts.contactNumber.toLowerCase().includes(dialedNumber.toLowerCase()) || contacts.contactName.toLowerCase().includes(dialedNumber.toLowerCase()))" class="call-history-row">
                  <b-col cols="1"><font-awesome-icon style="color:#ccc" icon="user" size="lg"/></b-col>
                  <b-col cols="7">
                    <p @click="openContact(call.contactId)" class="call-history-values call-history-values-name" >{{ call.contactName }}</p>
                    <p class="call-history-values call-history-values-number">{{ call.contactNumber }}</p>
                    </b-col>
                  <b-col cols="3" class="text-left">
                    <font-awesome-icon class="contact-side-icon" style="color:#ccc;cursor:pointer" @click="dialFromHistory(call.contactNumber,call.contactName)" icon="phone" size="sm"/>
                    <font-awesome-icon class="contact-side-icon" v-if="call.contactName == 'Unknown Caller'" style="color:#ccc;cursor:pointer" @click="addContact(call.contactNumber)" icon="user-plus" size="sm"/>
                  </b-col>
                </b-row>
              </div>
            </b-tab>
          </b-tabs>
        </div>
        <!-- <b-container v-show="homePageUrl == 'calllog'" class="body-container-content">
          <h6 style="text-align:left"> Call Logs </h6>
          
        </b-container> -->

        <!-- Add contact block-->
        <b-container v-show="homePageUrl == 'addcontact'" class="body-container-content">
          <template>
            <div>
              <b-form-group
                id="contactName"
                label="Contact Name"
                label-for="contactName"
                :invalid-feedback="nameInvalidFeedback"
                :state="nameState"
              >
                <b-form-input id="contactName" v-model="contactForm.contactName" size="sm" :state="nameState" trim></b-form-input>
              </b-form-group>

              <b-form-group
                id="contactNumber"
                label="Contact Number"
                label-for="contactNumber"
                :invalid-feedback="contactInvalidFeedback"
                :state="numberState"
              >
                <b-form-input id="contactNumber" v-model="contactForm.contactNumber" size="sm" :disabled="true" :state="numberState" trim></b-form-input>
              </b-form-group>

              <div class="call-handle-buttons-container">
                <b-button size="sm" pill @click="cancelCreateNewContact()" class="call-handle-buttons" variant="danger">
                     Cancel
                </b-button>
                <b-button size="sm" pill @click="createNewContact()" :disabled="addContactButton" class="call-handle-buttons" variant="success">
                     {{ addContactButtonText }}
                </b-button>
            </div>
            </div>
          </template>
        </b-container>
      </b-container> 

      <!-- On call block -->
      <b-container v-show="toggle_call_block" class="body-container call-block">
        <div class="call-handler">
          <div class="call-handler-contents">
            <h6 v-if="callStatus != 'Conference'"><span v-if="outBoundCall"> Outbound </span>{{ callStatus }}</h6>
            <h5 v-if="callStatus != 'Conference'">{{ callingName }}</h5>
            <h6 v-if="callStatus != 'Conference'">{{callingNumber}}</h6>
            <!-- <h6 v-if="callStatus == 'Connected' || callStatus == 'Muted' || callStatus == 'OnHold'">00:00</h6> -->
            <div v-if="callStatus == 'Incoming' || callStatus == 'Connecting' || callStatus == 'Calling'" class="call-handle-buttons-container">
                <b-button v-if="!outBoundCall" size="sm" pill @click="onAcceptedCall()" class="call-handle-buttons" variant="success">
                  <font-awesome-icon  icon="phone" size="sm"/>   {{ $t('accept') }}
                </b-button>
                <b-button size="sm" pill @click="onDeclineCall()" class="call-handle-buttons" variant="danger">
                  <font-awesome-icon  icon="phone-slash" size="sm"/>   {{ $t('decline') }}
                </b-button>
            </div>
            <div v-else-if="callStatus == 'Connected' || callStatus == 'Muted' || callStatus == 'On Hold' || callStatus == 'Calling'" class="call-handle-buttons-container">
                <b-button size="sm" :title="callStatus == 'On Hold' ?  'Unhold' : 'Hold' " @click="onHoldCall()" pill class="call-control-buttons" :variant="callStatus == 'On Hold' ?  'primary' : 'secondary' ">
                  <font-awesome-icon  :icon="callStatus == 'On Hold' ?  'play' : 'pause' " size="sm"/>
                </b-button>
                <b-button size="sm" :title="callStatus == 'Muted' ? 'Unmute' : 'mute' " @click="onMuteCall()" pill class="call-control-buttons" :variant="callStatus == 'Muted' ?  'primary' : 'secondary'">
                  <font-awesome-icon  :icon="callStatus == 'Muted' ?  'microphone-alt-slash' : 'microphone-alt'" size="sm"/> 
                </b-button>
                <b-button size="sm" title="Dialpad" @click="onDialPadCall()" pill class="call-control-buttons" variant="secondary">
                  <font-awesome-icon  icon="th" size="sm"/> 
                </b-button>
                <b-button size="sm" title="Transfer" @click="onTransferCall()" pill class="call-control-buttons" variant="secondary">
                  <font-awesome-icon  icon="random" size="sm"/>
                </b-button>
                <b-button @click="onEndCall()" class="call-handle-buttons" size="sm" variant="danger">
                  <font-awesome-icon  icon="phone-slash" size="sm"/>   {{ $t('end_call') }}
                </b-button>
            </div>
            <div v-else-if="callStatus == 'ACW' || callStatus == 'Ended' || callStatus == 'Missed' " class="call-handle-buttons-container">
                <b-button @click="setAvailable()" class="call-handle-buttons" size="sm" variant="secondary">
                  {{ $t('clear_contact') }}
                </b-button>
            </div>
            <div v-else-if="callStatus == 'Conference'" class="call-handle-buttons-container">
              <b-row class="call-history-row">
                <b-col cols="9">
                  <p class="call-history-values call-history-values-name" > <b> ( {{ confCall.callerOneStatus }} ) </b> {{ callingName }}</p>
                  </b-col>
                <b-col cols="3" class="text-left">
                  <font-awesome-icon class="contact-side-icon" style="color:#ccc;cursor:pointer" v-if="(confCall.callerOneStatus != 'On Hold') && (confCall.callerOneStatus != 'On Hold' && confCall.callerTwoStatus != 'On Hold')" @click="onHoldConf('one')" icon="pause" size="sm"/>
                  <font-awesome-icon class="contact-side-icon" style="color:#ccc;cursor:pointer" @click="onEndCallConf('one')" icon="phone-slash" size="sm"/>
                </b-col>
              </b-row>

              <b-row class="call-history-row">
                <b-col cols="9">
                  <p class="call-history-values call-history-values-name" > <b> ( {{ confCall.callerTwoStatus }} ) </b> {{ transferName }}</p>
                  </b-col>
                <b-col cols="3" class="text-left">
                  <font-awesome-icon class="contact-side-icon" style="color:#ccc;cursor:pointer" v-if="(confCall.callerTwoStatus != 'On Hold') && (confCall.callerOneStatus != 'On Hold' && confCall.callerTwoStatus != 'On Hold')" @click="onHoldConf('two')"  icon="pause" size="sm"/>
                  <font-awesome-icon class="contact-side-icon" style="color:#ccc;cursor:pointer" @click="onEndCallConf('two')" icon="phone-slash" size="sm"/>
                </b-col>
              </b-row>

              <div class="call-handle-buttons-container">
                <b-button size="sm" title="Hold All" v-if="confCall.callerOneStatus != 'On Hold' || confCall.callerTwoStatus != 'On Hold'" @click="onHoldAll()" pill class="call-control-buttons" variant="secondary">
                  <font-awesome-icon  icon="pause" size="sm"/>
                </b-button>
                <b-button size="sm" title="Resume All" v-if="confCall.callerOneStatus == 'On Hold' && confCall.callerTwoStatus == 'On Hold'"  @click="onResumeConf()" pill class="call-control-buttons" variant="secondary">
                  <font-awesome-icon  icon="play" size="sm"/>
                </b-button>
                <b-button size="sm" :title="onMute == 'Muted' ? 'Unmute' : 'mute'" @click="onMuteConf()" pill class="call-control-buttons" :variant="onMute ?  'primary' : 'secondary'">
                  <font-awesome-icon  :icon="onMute ?  'microphone-alt-slash' : 'microphone-alt'" size="sm"/> 
                </b-button>
                <b-button size="sm" title="Join" v-if="confCall.callerOneStatus != 'Joined' || confCall.callerTwoStatus != 'Joined'" @click="onJoinCall()" pill class="call-control-buttons" variant="secondary">
                  <font-awesome-icon  icon="compress" size="sm"/> 
                </b-button>
                <b-button size="sm" title="Swap" v-if="(confCall.callerOneStatus != 'On Hold' && confCall.callerTwoStatus != 'On Hold') || (confCall.callerOneStatus != 'Joined' && confCall.callerTwoStatus != 'Joined')" @click="onSwapCall()" pill class="call-control-buttons" variant="secondary">
                  <font-awesome-icon  icon="exchange-alt" size="sm"/>
                </b-button>
                <b-button @click="onLeaveCall()" class="call-handle-buttons" size="sm" variant="danger">
                  <font-awesome-icon  icon="phone-slash" size="sm"/>   {{ $t('leave_call') }}
                </b-button>
              </div>
            </div>  
            <div style="width: 325px;margin-top: 10px;" v-if="callStatus != 'Missed'">
              
              <div v-if="!editor">
                <b-row >
                  <b-col cols="6">
                    <h6  class="incoming-ticket-heading">{{ $t('open_tickets') }}</h6>
                  </b-col>
                  <b-col cols="6">
                    <!-- <b-button  title="Open new ticket page" @click="openCreateTicket()" pill size="sm" class="call-create-ticket" variant="outline-primary"><font-awesome-icon icon="external-link-alt" size="sm"/></b-button> -->
                    <b-button @click="createTicket()" :disabled="noteCreateDisable" pill size="sm" class="call-create-ticket" variant="primary"><font-awesome-icon v-if=" createTicketButton == 'New Ticket'" icon="plus" size="sm"/> {{ createTicketButton }}</b-button>   
                  </b-col>
                </b-row>
                <div  class="tickets-list">
                  <div v-if="additionalFields" class="additional-fields"> <b>For : </b>{{ this.additionalFields }}</div>
                  <b-row :key= "index" v-for="(ticket,index)  in  tickets" class="ticket-history-row">
                    <b-col cols="12">
                      <b-row>
                        <b-col cols="6">
                          <p @click="openTicket(ticket.id)" class="call-history-values call-history-values-name" > <strong>#</strong> {{ ticket.id }}</p>
                        </b-col>
                        <b-col cols="6">
                          <b-button @click="createNote(ticket.id)" pill size="sm" class="call-addnote-ticket" variant="outline-secondary"><font-awesome-icon  icon="plus" size="sm"/> Note</b-button>
                        </b-col>
                      </b-row>
                      <p class="call-history-values call-history-values-number">{{ ticket.subject}}</p>
                    </b-col>
                  </b-row>
                </div>
              </div>
              <div v-if="editor">
                <b-row >
                  <b-col cols="5">
                    <h6  class="incoming-ticket-heading">{{ editorHeading }}</h6>
                  </b-col>
                  <b-col cols="7">
                    <b-button @click="createNoteSubmit()" :disabled="noteCreateDisable" pill size="sm" class="call-create-ticket" variant="outline-success"><font-awesome-icon v-if="edittorButtonName == 'Save Note'" icon="plus" size="sm"/> {{ edittorButtonName }}</b-button>
                    <b-button @click="cancelEditor()" pill size="sm" class="call-create-ticket" variant="outline-danger"><font-awesome-icon  icon="chevron-left" size="sm"/> Cancel</b-button>
                  </b-col>
                </b-row>
                <div style="margin-top: 10px" class="editor-textarea">
                  <b-form-textarea
                    id="textarea"
                    v-model="editorText"
                    placeholder="Enter note..."
                    rows="8"
                    max-rows="8"
                  ></b-form-textarea>
                </div>  
              </div> 
            </div> 
          </div>
        </div>
      </b-container>


    <!-- Quick Connects view -->
      <b-container v-show="toggle_quick_connect" class="body-container">

        <div class="quick-connects-head">
          <font-awesome-icon @click="backToCall()" class="quick-connects-close-icon" icon="times" size="sm"/>
          <span class="quick-connects-title" > Quick connects </span>
        </div>

        <div class="quick-connects-body">
        <b-row :key= "index" v-for="(contact,index) in quickconnects">
          <b-col cols="9">
            <p class="quick-connects-name">{{ contact.name }} </p>
          </b-col>
          <b-col cols="3" class="text-left">
            <font-awesome-icon class="contact-side-icon" style="color:#ccc;cursor:pointer" @click="callTransfer(contact.name,contact)" icon="phone" size="sm"/>
          </b-col>
        </b-row>
        </div>

      </b-container> 

      <b-container v-if="pageUrl == 'call'" v-show="toggle_dial_pad" class="body-container">

        <b-input-group>
          <b-input-group-prepend>
            <b-button class="dial-pad-country-code" @click="toggleCountryCodeCall()" variant="outline-light">
              <span class="flag-icon" v-bind:class="selectedCountry.flag"></span> + {{selectedCountry.code}}
              <font-awesome-icon style="color:#ccc" icon="caret-down" size="sm"/>
            </b-button>
          </b-input-group-prepend>

          <b-form-input class="dial-pad-number" v-model="dialedNumber" type="text"></b-form-input>

          <b-button class="dial-pad-button"  variant="outline-light">
              <font-awesome-icon icon="th" size="lg"/>
          </b-button>
          <b-button :disabled="dialedNumber.length >= 10 ? false : true" @click="onDialCallConf()" variant="secondary">
            <font-awesome-icon style="color:#fff" icon="phone" size="lg"/>
          </b-button>
        </b-input-group>
       
        <!-- country code block -->
        <b-container v-if="callPageUrl == 'countrycode'" class="body-container-content">
          <model-list-select :list="dialableCountries"
                     v-model="selectedCountry"
                     option-value="flag"
                     option-text="name">
          </model-list-select>
          <b-button @click="backToDialpad()" style="margin-top:10px" pill size="sm">Back</b-button>
        </b-container>
        
        <!-- dialpad block -->
        <b-container v-if="callPageUrl == 'dialpad'" class="body-container-content">
          <div class="button-row">
            <b-button variant="outline-secondary" class="dialpad-button" @click="keyDial('1')">
              <div class="dialpad-number">1</div>
              <span class="dialpad-filler">...</span>
            </b-button>
            <b-button variant="outline-secondary" class="dialpad-button" @click="keyDial('2')">
              <div class="dialpad-number">2</div>
              <span class="dialpad-letters">ABC</span>
            </b-button>
            <b-button variant="outline-secondary" class="dialpad-button" @click="keyDial('3')">
              <div class="dialpad-number">3</div>
              <span class="dialpad-letters">DEF</span>
            </b-button>
          </div>
          <div class="button-row">
            <b-button variant="outline-secondary" class="dialpad-button" @click="keyDial('4')">
              <div class="dialpad-number">4</div>
              <span class="dialpad-letters">GHI</span>
            </b-button>
            <b-button variant="outline-secondary" class="dialpad-button" @click="keyDial('5')">
              <div class="dialpad-number">5</div>
              <span class="dialpad-letters">JKL</span>
            </b-button>
            <b-button variant="outline-secondary" class="dialpad-button" @click="keyDial('6')">
              <div class="dialpad-number">6</div>
              <span class="dialpad-letters">MNO</span>
            </b-button>
          </div>
          <div class="button-row">
            <b-button variant="outline-secondary" class="dialpad-button" @click="keyDial('7')">
              <div class="dialpad-number">7</div>
              <span class="dialpad-letters">PQRS</span>
            </b-button>
            <b-button variant="outline-secondary" class="dialpad-button" @click="keyDial('8')">
              <div class="dialpad-number">8</div>
              <span class="dialpad-letters">TVU</span>
            </b-button>
            <b-button variant="outline-secondary" class="dialpad-button" @click="keyDial('9')">
              <div class="dialpad-number">9</div>
              <span class="dialpad-letters">WXYZ</span>
            </b-button>
          </div>
          <div class="button-row">
            <b-button variant="outline-secondary" class="dialpad-button" @click="keyDial('*')">
              <div class="dialpad-number">*</div>
            </b-button>
            <b-button variant="outline-secondary" class="dialpad-button" @click="keyDial('0')">
              <div class="dialpad-number">0</div>
              <span class="dialpad-letters">+</span>
            </b-button>
            <b-button variant="outline-secondary" class="dialpad-button" @click="keyDial('#')">
              <div class="dialpad-number">#</div>
            </b-button>
          </div>

          <b-button @click="backToCallDial()" style="margin-top:10px" pill size="sm">Back</b-button>
        </b-container>

      </b-container>   

    </b-container>

    <b-container v-if="!loggedin && currentActiveTab <=0" class="bv-example-row pre-signin">
        <h4>Signin to AWS Instance</h4>
        <h6 style="color: #00425f !important;"> <strong>{{ connect_url}} </strong></h6>
        <!-- <b-button style="margin-bottom:10px" size="sm" @click="openLogin()">Click to signin</b-button> -->
        <h6>Refresh the tab if you face any issues</h6>
    </b-container>


    <b-container v-if="currentActiveTab > 0" class="bv-example-row pre-signin">
        <b-button size="sm" @click="singinHere()">Signin Here</b-button>
    </b-container>
  </div>
</template>

<script>
import { ModelListSelect } from 'vue-search-select'
import 'amazon-connect-streams'
import 'amazon-connect-chatjs'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'flag-icon-css/css/flag-icon.css'
import 'vue-search-select/dist/VueSearchSelect.css'
import  { dialableCountries } from '../utils/dialableCountries'
import * as moment from 'moment';
import axios from 'axios';


export default {
  computed: {
      nameState() {
        return this.contactForm.contactName.length >= 4 ? true : false
      },
      numberState() {
        return this.contactForm.contactNumber.length >= 10 ? true : false
      },
      // nameInvalidFeedback() {
      //   if (this.contactForm.contactName.length > 4) {
      //     return ''
      //   } else if (this.contactForm.contactName.length > 0) {
      //     return 'Enter at least 4 characters'
      //   }
      // },
      // contactInvalidFeedback() {
      //   if (this.contactForm.contactNumber.length > 10) {
      //     return ''
      //   } else if (this.contactForm.contactNumber.length > 0) {
      //     return 'Enter valid phone number'
      //   }
      // },
    },
  data() {
    return {
      callContact: "",
      toggle_dial_pad: false,
      callPageUrl: "dialpad",
      timer: '',
      currentActiveTab: '',
      currentActiveTabTime: '',
      transferName : '',
      transferNumber: '',
      toggle_transfer: false,
      additionalFields: false,
      languageSelected : 'en' ,
      contactTabSelected: false,
      countryCodefromDB: false,
      languageOptions: [
        { value: 'en', text: 'English' },
        { value: 'ja', text: 'Japanese' }
      ],
      dialedNumber: '',
      createTicketButton : "New Ticket",
      editor: false,
      editorHeading: "",
      edittorButtonName: "",
      noteCreateDisable: false,
      editorText: "",
      loggedin: false,
      connect_url: '',
      instanceName : '',
      pageUrl: "home", //home
      homePageUrl : "calllog",
      dialedNumbersettings: '',
      outBoundCall: false,
      agentStatus: '',
      changeItem : 0,
      toggle_call_history: true,
      // toggle_dial_pad: false,
      toggle_country_code : false,
      toggle_country_code_settings: false,
      toggle_call_block: false, //false
      toggle_quick_connect : false,
      selected_phone_type: 1,
      agentStates: [],
      phoneTypesOption: [
          { text: 'Softphone', value: '1' },
          { text: 'Desk phone', value: '2' }
      ],
      toogle_settings: false,
      dialableCountries: [
          // { code: '91', name: '+ 91' + ' - ' + 'India', flag: 'flag-icon-in' },
          // { code: '1', name: '+ 1' + ' - ' + 'United States', flag: 'flag-icon-us' },
          // { code: '297', name: '+ 297' + ' - ' + 'Aruba', flag: 'flag-icon-7' },
          // { code: '43', name: '+ 43' + ' - ' + 'Austria', flag: 'flag-icon-at' },
          // { code: '229', name: '+ 229' + ' - ' + 'Benin', flag: 'flag-icon-bj' },
        ],
      call_history: [ 
          // {"contactNumber":"+18336624150","contactId":"2043070846346","calledTime":"1583845185","contactName":"Bobb"}
        // { "contactId" : "1" , "contactName" : "Unknown Caller" , "contactNumber" : "+18333537852"},
        // { "contactId" : "2" , "contactName" : "Boopathi" , "contactNumber" : "+18333537852"},
        // { "contactId" : "2" , "contactName" : "Boopathi" , "contactNumber" : "+18444444852"},
        // { "contactId" : "1" , "contactName" : "Unknown Caller" , "contactNumber" : "+18333537852"},
        // { "contactId" : "2" , "contactName" : "Boopathi" , "contactNumber" : "+18333537852"},
        // { "contactId" : "2" , "contactName" : "Boopathi" , "contactNumber" : "+18444444852"},
        // { "contactId" : "1" , "contactName" : "Unknown Caller" , "contactNumber" : "+18333537852"},
        // { "contactId" : "2" , "contactName" : "Boopathi" , "contactNumber" : "+18333537852"},
        // { "contactId" : "2" , "contactName" : "Boopathi" , "contactNumber" : "+18444444852"},
        // { "contactId" : "1" , "contactName" : "Unknown Caller" , "contactNumber" : "+18333537852"},
        // { "contactId" : "2" , "contactName" : "Boopathi" , "contactNumber" : "+18333537852"},
        // { "contactId" : "2" , "contactName" : "Boopathi" , "contactNumber" : "+18444444852"}
      ],
      contacts: [ 
        // { "contactId" : "1" , "contactName" : "Bob" , "contactNumber" : "+18333537852"},
        // { "contactId" : "2" , "contactName" : "Tom" , "contactNumber" : "+18333537852"},
        // { "contactId" : "2" , "contactName" : "Steve" , "contactNumber" : "+18444444852"}
      ],
      tickets: [ 
        // { "id" : "18" , "subject" : "this is subject of the sample aws connect ticket generated by aws connect phone sandeza" },{ "id" : "19" , "subject" : "this is subject of the sample aws connect ticket generated by aws connect phone sandeza" },{ "id" : "20" , "subject" : "this is subject of the sample aws connect ticket generated by aws connect phone sandeza" },{ "id" : "21" , "subject" : "this is subject of the sample aws connect ticket generated by aws connect phone sandeza" },{ "id" : "345678" , "subject" : "this is subject of the sample aws connect ticket generated by aws connect phone sandeza" },{ "id" : "7654765" , "subject" : "this is subject of the sample aws connect ticket generated by aws connect phone sandeza" }
      ],
      selectedCountry: { code: '1', flag: 'flag-icon-us' },
      selectedCountrySettings: { code: '1', flag: 'flag-icon-us' },
      onAccepted: true,
      onHold: false,
      onMute: false,
      callStatus: "Connected", //Incoming
      callingName : "Unknown Caller",
      callingId: "",
      callingNumber: "+1 234567890",
      contactObject : "",                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
      agentObject : "",
      agentUserName: "",
      callStartTime: "",
      callEndTime: "",
      newCreatedTicket: 0,
      newNoteCreated: "",
      addNoteFor: "",
      activeContactId: "",
      contactForm : {
        contactName : '',
        contactNumber: ''
      },
      addContactButton: false,
      addContactButtonText: "Save Contact",
      newContactCreated:'',
      setAvailableTrigger: false,
      quickconnects: [],
      confCall : {
        callerOneStatus : 'Hold',
        callerTwoStatus : 'Hold'
      },
      access_key : "",
      integration_id : "",
    }
  },
  
  created(){
    let uri = window.location.search.substring(1); 
    console.log("THIS IS uri",uri)
    let params = new URLSearchParams(uri);
    console.log("THIS IS PARAMS",params)
    this.connect_url = params.get("connect_url");

    // this.connect_url = 'https://sandeza-testing.my.connect.aws'
    // this.access_key = params.get("access_key");
    // this.integration_id = params.get("integration_id");
    console.log("URL params url ==> " +params.get("connect_url"));
    console.log("%%%%=>")
    console.log("%%%%=>" + window.top.location.href)
    // console.log("%%%%=>" + this.access_key + "   " + this.integration_id)
  },
  mounted() {
    this.handleLogin();
  },
  watch: {
    // dialedNumber: function() {
    //   if(this.contactTabSelected){
    //     let passData = {};
    //     passData.action = "searchContact";
    //     passData.query = this.dialedNumber;
    //     parent.postMessage(passData,"*");
    //     console.log("search contact " + JSON.stringify(passData));
    //   }
    // },
    languageSelected: function() {
      this.$i18n.locale = this.languageSelected;
      var passData = {};
      passData.action = "languageChange";
      passData.agentId = this.agentUserName;
      passData.language = this.languageSelected;

      this.storeLanguageSelected(passData)

      console.log("Language Changed to "+ this.languageSelected);
      //parent.postMessage(passData,"*");
    },
    newCreatedTicket: function() {
      if(this.newCreatedTicket > 0) {
        this.createTicketButton = "New Ticket";
        this.noteCreateDisable = false;
        this.createNote(this.newCreatedTicket);
        this.newCreatedTicket = 0;
      }
    },
    newNoteCreated: function(){
      if(this.newNoteCreated == "success") {
        this.newNoteCreated = "";
        this.editorText = "";
        this.edittorButtonName = "Save Note";
        this.noteCreateDisable = false;
        this.cancelEditor();
      }
    },
    newContactCreated: function(){
      if(this.newContactCreated == "success") {
        this.contactForm.contactName = "";
        this.edittorButtonName = "Save Contact";
        this.addContactButton = false;
        this.homePageUrl = "calllog"
      }
    },
    selectedCountry: function () {
        var passData = {};
        passData.action = "countryChange";
        passData.agentId = this.agentUserName;
        passData.countrySelected = JSON.stringify(this.selectedCountry);

        this.storeCountrySelected(passData)

        console.log("Dialing country changed");
        parent.postMessage(passData,"*");
    },
    selectedCountrySettings: function () {
      this.toggle_country_code_settings = !this.toggle_country_code_settings;
    },
    callStatus: function() {
      if(this.callStatus == "Ended"){
        //this.toggle_call_block = false;
      }
    }
  },
  methods: {

    async backendCreateTicket(payload) {

      let { phoneNumber , contactId , viaType} = payload

      var headers = {
          "Content-Type": "application/json",
          "Authorization": this.access_key + ":" + this.integration_id
      };

      var options = { headers: headers};

      try {

      let data = await axios.post('https://devapi.arta.sandeza.io/integration/v1/helpdesk/ticket', { phoneNumber : phoneNumber , viaId: viaType, contactId : contactId + ""}, options);
      
        console.log(data)

        this.createTicketButton = "New Ticket";
        this.noteCreateDisable = false;
        this.newCreatedTicket = data.data.message.ticketId;
        this.createNote(data.data.message.ticketId);
        this.newCreatedTicket = 0;
            
        let ticket = {}
        ticket.id = data.data.message.ticketId;
        ticket.subject = data.data.message.subject

        let passData = {}
        passData.action = "openTicket"
        passData.type = "success"
        passData.ticketId = data.data.message.ticketId
        passData.message = "New ticket created sucessfully"
        parent.postMessage(passData,"*");

        this.tickets.unshift(ticket)

      } catch(e) {
        console.log(e)
        this.createTicketButton = "New Ticket";
        let passData = {}
        passData.action = "openTicketFail"
        passData.type = "danger"
        passData.message = "Failed to create New ticket"
        parent.postMessage(passData,"*");

      }
    },
    // async backendCreateNormalNote(payload) {


    //   let { action , ticketId , note } = payload

    //   var headers = {
    //       "Content-Type": "application/json",
    //       "Authorization": this.access_key + ":" + this.integration_id
    //   };

    //   var options = { headers: headers};

    //   try {

    //     console.log({ note : note , ticketId : ticketId + "", type : action , contactId : "null" , agentHandled : "null" })

    //     let data = await axios.post('https://devapi.arta.sandeza.io/integration/v1/helpdesk/note', { note : note , ticketId : ticketId + "", type : action , contactId : "null" , agentHandled : "null" }, options);
      
    //     console.log(data)

    //     this.newNoteCreated = "success"
    //     let passData = {}
    //     passData.action = "addNote"
    //     passData.type = "success"
    //     passData.ticketId = ticketId
    //     passData.message = "Call Notes added in ticket #" + ticketId
    //     parent.postMessage(passData,"*");

    //   } catch(e) {
    //     let passData = {}
    //     passData.action = "addNoteFail"
    //     passData.type = "danger"
    //     passData.message = "Adding call notes failed"
    //     parent.postMessage(passData,"*");
    //     console.log(e)
    //   }
    // },
    // async backendCreateEndcallNote(payload) {


    //   let { action , ticketId , contactId , agentHandled} = payload

    //   var headers = {
    //       "Content-Type": "application/json",
    //       "Authorization": this.access_key + ":" + this.integration_id
    //   };

    //   var options = { headers: headers};

    //   try {

    //   let data = await axios.post('https://devapi.arta.sandeza.io/integration/v1/helpdesk/note', { note : "null" , ticketId : ticketId + "", type : action , contactId : contactId + "" , agentHandled : agentHandled }, options);
      
    //     console.log(data)

    //     this.newNoteCreated = "success"

    //     let passData = {}

    //     passData.action = "addNote"
    //     passData.type = "success"
    //     passData.ticketId = ticketId
    //     passData.message = "Endcall Notes added in ticket #" + ticketId
    //     parent.postMessage(passData,"*");

    //   } catch(e) {
    //     let passData = {}
    //     passData.action = "addNoteFail"
    //     passData.type = "danger"
    //     passData.message = "Endcall Notes adding failed"
    //     parent.postMessage(passData,"*");
    //     console.log(e)
    //   }
    // },
    // async backendCreateContact(payload) {

    //   let { contactName , contactNumber } = payload

    //   var headers = {
    //       "Content-Type": "application/json",
    //       "Authorization": this.access_key + ":" + this.integration_id
    //   };

    //   var options = { headers: headers};

    //   try {

    //   let data = await axios.post('https://devapi.arta.sandeza.io/integration/v1/helpdesk/contact', { contactName : contactName , contactNumber : contactNumber }, options);
      
    //   this.newContactCreated = "success"
    //   let passData = {}
    //   passData.action = "openContact"
    //   passData.type = "success"
    //   passData.contactId = data.data.message.contactId
    //   passData.message = "Added to contacts sucessfully"
    //   parent.postMessage(passData,"*");

    //   } catch(e) {
    //     console.log(e)
    //     let passData = {}
    //     passData.action = "openContactFail"
    //     passData.type = "danger"
    //     passData.message = "Failed to create contact"
    //     parent.postMessage(passData,"*");
    //   }
    // },
    async getContacts() {

      var headers = {
          "Content-Type": "application/json",
          "Authorization": "9lbr4YVd6WeOTucnfPTnTJnB0i4gVH7E8sExiYVI"
      };

      var options = { headers: headers};

      try {

      let data = await axios.get('https://d3v-sandeza.zendesk.com/api/v2/users', options);

      this.contacts = data.data;
      
      console.log("GET CONTACT INFO",this.contacts)

      } catch(e) {
        console.log(e)
      }

    },

    async getRequesterInfo(requesterId) {

      var headers = {
          "Content-Type": "application/json",
          "Authorization": "9lbr4YVd6WeOTucnfPTnTJnB0i4gVH7E8sExiYVI"
      };

      var options = { headers: headers};

      try {

      let data = await axios.get('https://d3v-sandeza.zendesk.com/api/v2/users/'+ requesterId , options);

      // this.onDialCallFromFD(data.data.message.name,data.data.message.number)
      this.onDialCallFromFD(data.data.message.name,data.data.message.phone)

      } catch(e) {
        console.log(e)
      }

    },

    // async getCallLogs() {

    //   var headers = {
    //       "Content-Type": "application/json",
    //       "Authorization": "9lbr4YVd6WeOTucnfPTnTJnB0i4gVH7E8sExiYVI"
    //   };

    //   var options = { headers: headers};

    //   try {

    //     let data = await axios.get('https://d3v-sandeza.zendesk.com/api/v2/users/' + this.agentUserName + '/CALLLOGS' , options);
    //     this.call_history = JSON.parse(data.data.storageValue);

    //   } catch(e) {
    //     console.log(e)
    //     this.call_history = []
    //   }

    // },

    // async getCountryCode() {

    //   var headers = {
    //       "Content-Type": "application/json",
    //       "Authorization": this.access_key + ":" + this.integration_id
    //   };

    //   var options = { headers: headers};

    //   try {

    //     let data = await axios.get('https://devapi.arta.sandeza.io/integration/v1/storage/' + this.agentUserName + '/COUNTRYCODE' , options);
    //     this.selectedCountry = JSON.parse(data.data.storageValue);

    //   } catch(e) {
    //     console.log(e)
    //   }

    // },

    // async getLanguage() {

    //   var headers = {
    //       "Content-Type": "application/json",
    //       "Authorization": this.access_key + ":" + this.integration_id
    //   };

    //   var options = { headers: headers};

    //   try {

    //     let data = await axios.get('https://devapi.arta.sandeza.io/integration/v1/storage/' + this.agentUserName + '/LANGUAGE' , options);
    //     this.languageSelected = data.data.storageValue;

    //   } catch(e) {
    //     console.log(e)
    //   }

    // },

    // async storeCallLogs(payload) {

    //   var headers = {
    //       "Content-Type": "application/json",
    //       "Authorization": this.access_key + ":" + this.integration_id
    //   };

    //   var options = { headers: headers};

    //   this.call_history.unshift(payload);

    //   try {

    //     console.log(payload)

    //   await axios.post('https://devapi.arta.sandeza.io/integration/v1/storage', { agentId : this.agentUserName , storageKey : "CALLLOGS" , storageValue : JSON.stringify(this.call_history) }, options);

    //   } catch(e) {
    //     console.log(e)
    //   }

    // },

    // async storeLanguageSelected(payload) {

    //   var headers = {
    //       "Content-Type": "application/json",
    //       "Authorization": this.access_key + ":" + this.integration_id
    //   };

    //   var options = { headers: headers};

    //   try {

    //     console.log(payload)

    //   await axios.post('https://devapi.arta.sandeza.io/integration/v1/storage', { agentId : this.agentUserName , storageKey : "LANGUAGE" , storageValue : payload.language }, options);

    //   } catch(e) {
    //     console.log(e)
    //   }

    // },
    // async storeCountrySelected(payload) {

    //   var headers = {
    //       "Content-Type": "application/json",
    //       "Authorization": this.access_key + ":" + this.integration_id
    //   };

    //   var options = { headers: headers};

    //   try {

    //     console.log(payload)

    //   await axios.post('https://devapi.arta.sandeza.io/integration/v1/storage', { agentId : this.agentUserName , storageKey : "COUNTRYCODE" , storageValue : payload.countrySelected }, options);

    //   } catch(e) {
    //     console.log(e)
    //   }

    // },
    openLogin(){
      window.open(this.connect_url);
    },
    // onDialCallConf(connect,lily) {
    //   let thisKey = this;
    //   let num =  connect.Endpoint.byPhoneNumber("+" + this.selectedCountry.code + this.dialedNumber);
    //   this.transferName = "Unknown";
    //   this.transferNumber = "+" + this.selectedCountry.code + this.dialedNumber;

    //   this.agentObject.getContacts(lily.ContactType.VOICE)[0].addConnection(num, {
    //     success: function(data) {
    //       thisKey.toggle_dial_pad = false;
    //       thisKey.callStatus = "Conference";
    //       thisKey.toggle_call_block = true;
    //       thisKey.confCall['callerOneStatus'] = "On Hold"
    //       thisKey.confCall['callerTwoStatus'] = "Connecting"
    //       console.log("transfer success");
    //       console.log(data);
    //      // thisKey.checkTransferStatus();
    //     },
    //     failure: function(data) {
    //       console.log("transfer failed");
    //       console.log(data);
    //     }
    //   });
    // },

    backToDialpad(){
      this.callPageUrl = "dialpad"
    },

    singinHere(){
      console.log("signin here clicked")
      localStorage.setItem("activeTab", "0");
      localStorage.setItem("activeTabTime", moment().format());
      location.reload();
    },

    // onHoldAll(){
    //   let thisKey = this;
    //   let contact = this.contactObject;

    //   try {
    //     contact.getInitialConnection().hold({
    //       success: function() { 
    //         thisKey.confCall.callerOneStatus = "On Hold";
    //         console.log("changed caller one to hold" + contact.getInitialConnection().isOnHold());
    //       },
    //       failure: function() { 
    //         //thisKey.confCall.callerOneStatus = thisKey.confCall.callerOneStatus == "Joined" ? "Joined" : "Connected";
    //         console.log("changed caller one to hold" + contact.getInitialConnection().isOnHold());
    //       }
    //     });
    //   } catch (e) {
    //     console.log("changed iitial caller one to hold failed")
    //   }
    //   try {
    //     contact.getSingleActiveThirdPartyConnection().hold({
    //       success: function() { 
    //         thisKey.confCall.callerTwoStatus = "On Hold" ;
    //         console.log("changed caller two to hold" + contact.getSingleActiveThirdPartyConnection().isOnHold());
    //       },
    //       failure: function() { 
    //        // thisKey.confCall.callerTwoStatus = contact.getSingleActiveThirdPartyConnection().isOnHold() ? "On Hold" : "Connected" ;
    //         console.log("changed caller two to hold" + contact.getSingleActiveThirdPartyConnection().isOnHold());
    //       }
    //     });
    //   } catch (e) {
    //     console.log("changed iitial caller one to hold failed")
    //   }
    // },
    //  onEndCallConf(caller){
    //   let thisKey = this;
    //   let contact = this.contactObject;
    //   if(caller == "one") {
    //     try {
    //       contact.getInitialConnection().destroy({
    //         success: function() {
    //           thisKey.callStatus = "Connected";
    //           thisKey.callingName = thisKey.transferName;
    //           thisKey.callingNumber = thisKey.transferNumber;
    //           console.log("Ended Initial");
    //         },
    //         failure: function() { 
    //           console.log("Ended Initial failed");
    //         }
    //       });
    //     } catch (e) {
    //       console.log("Ended Initial failed")
    //     }
    //   } else {
    //     try {
    //       let conn = contact.getSingleActiveThirdPartyConnection();

    //       console.log(conn.isConnected() , conn.isConnecting())

    //       if(conn.isConnected() || conn.isConnecting()) {
    //         contact.getSingleActiveThirdPartyConnection().destroy({
    //           success: function() { 
    //             thisKey.callStatus = "Connected";
    //             console.log("Ended external success");
    //           },
    //           failure: function() { 
    //             console.log("Ended external failed");
    //           }
    //         });
    //       } else {
    //         thisKey.callStatus = "Connected";
    //       }
    //     } catch (e) {
    //       thisKey.callStatus = "Connected";
    //       console.log("Ended external failed");
    //       console.log(e)
    //     }
    //   }
    // },
    // onResumeConf(caller){
    //   let thisKey = this;
    //   let contact = this.contactObject;
    //   thisKey.confCall.callerOneStatus = "Connected";
    //   thisKey.confCall.callerTwoStatus = "Connected";
    //   if(caller == "one") {
    //     try {
    //       contact.getInitialConnection().resume({
    //         success: function() { 
    //           thisKey.confCall.callerOneStatus = "Connected";
    //           console.log("changed caller one to hold" + contact.getInitialConnection().isOnHold());
    //         },
    //         failure: function() { 
    //           //thisKey.confCall.callerOneStatus = thisKey.confCall.callerOneStatus == "Joined" ? "Joined" : "Connected";
    //           console.log("changed caller one to hold" + contact.getInitialConnection().isOnHold());
    //         }
    //       });
    //     } catch (e) {
    //       console.log("changed iitial caller one to hold failed")
    //     }
    //   } else {
    //     try {
    //       contact.getSingleActiveThirdPartyConnection().resume({
    //         success: function() { 
    //           thisKey.confCall.callerTwoStatus = "Connected" ;
    //           console.log("changed caller two to hold" + contact.getSingleActiveThirdPartyConnection().isOnHold());
    //         },
    //         failure: function() { 
    //           //thisKey.confCall.callerTwoStatus = contact.getSingleActiveThirdPartyConnection().isOnHold() ? "On Hold" : "Connected" ;
    //           console.log("changed caller two to hold" + contact.getSingleActiveThirdPartyConnection().isOnHold());
    //         }
    //       });
    //     } catch (e) {
    //       console.log("changed iitial caller one to hold failed")
    //     }
    //   }
    // },
    // onHoldConf(caller){
    //   let thisKey = this;
    //   let contact = this.contactObject;
    //   if(caller == "one") {
    //     try {
    //       contact.getInitialConnection().hold({
    //         success: function() { 
    //           thisKey.confCall.callerOneStatus = "On Hold";
    //           console.log("changed caller one to hold" + contact.getInitialConnection().isOnHold());
    //         },
    //         failure: function() { 
    //           //thisKey.confCall.callerOneStatus = thisKey.confCall.callerOneStatus == "Joined" ? "Joined" : "Connected";
    //           console.log("changed caller one to hold" + contact.getInitialConnection().isOnHold());
    //         }
    //       });
    //     } catch (e) {
    //       console.log("changed iitial caller one to hold failed")
    //     }
    //   } else {
    //     try {
    //       contact.getSingleActiveThirdPartyConnection().hold({
    //         success: function() { 
    //           thisKey.confCall.callerTwoStatus = "On Hold" ;
    //           console.log("changed caller two to hold" + contact.getSingleActiveThirdPartyConnection().isOnHold());
    //         },
    //         failure: function() { 
    //           //thisKey.confCall.callerTwoStatus = contact.getSingleActiveThirdPartyConnection().isOnHold() ? "On Hold" : "Connected" ;
    //           console.log("changed caller two to hold" + contact.getSingleActiveThirdPartyConnection().isOnHold());
    //         }
    //       });
    //     } catch (e) {
    //       console.log("changed iitial caller one to hold failed")
    //     }
    //   }
    // },
    // onSwapCall(){
    //   let thisKey = this;
    //   let contact = this.contactObject;
    //   contact.toggleActiveConnections({
    //     success: function() { 
    //         thisKey.confCall.callerOneStatus = contact.getInitialConnection().isOnHold() ?  "Connected" : "On Hold" ;
    //         thisKey.confCall.callerTwoStatus = contact.getSingleActiveThirdPartyConnection().isOnHold() ? "Connected" : "On Hold" ;
    //      },
    //     failure: function() {
    //       thisKey.confCall.callerOneStatus = contact.getInitialConnection().isOnHold() ? "Connected" : "On Hold" ;
    //       thisKey.confCall.callerTwoStatus = contact.getSingleActiveThirdPartyConnection().isOnHold() ? "Connected" : "On Hold" ;
    //       console.log("toggle fail");
    //     }
    //   });
    // },
    // onMuteConf(){
    //   this.onMute = !this.onMute;
      
    //   if(this.onMute){
    //     this.agentObject.mute();
    //   } else {
    //     this.agentObject.unmute();
    //   }
    // },
    // onJoinCall(){
    //   let thisKey = this;
    //   let contact = this.contactObject;

    //   contact.conferenceConnections({
    //     success: function() { 
    //       console.log("Joined call")
    //       thisKey.confCall.callerOneStatus = "Joined"
    //       thisKey.confCall.callerTwoStatus = "Joined"
    //      },
    //     failure: function(err) {
    //         console.log("Join call failed");
    //         console.log(err);
    //      }
    //   });
    // },
    // onLeaveCall() {
    //   let contact = this.contactObject;
    //   contact.getAgentConnection().destroy();
    // },
    // callTransfer(name,endpoint,lily){
    //   console.log("Call transfer Initiated to " + name);
    //   let thisKey = this;
    //   this.transferName = name;
    //   this.transferNumber = endpoint.type;

    //   this.agentObject.getContacts(lily.ContactType.VOICE)[0].addConnection(endpoint, {
    //     success: function(data) {
    //       thisKey.toggle_quick_connect = false;
    //       thisKey.callStatus = "Conference";
    //       thisKey.toggle_call_block = true;
    //       thisKey.confCall['callerOneStatus'] = "On Hold"
    //       thisKey.confCall['callerTwoStatus'] = "Connecting"
    //       console.log("transfer success");
    //       console.log(data);
    //      // thisKey.checkTransferStatus();
    //     },
    //     failure: function(data) {
    //       console.log("transfer failed");
    //       console.log(data);
    //     }
    //   });
    // },
    // onTransferCall() {
    //   this.pageUrl = "call";
    //   this.toggle_call_block = false
    //   this.toggle_quick_connect = true;
    // },
    // onDialPadCall() {
    //   this.pageUrl = "call";
    //   this.toggle_call_block = false
    //   this.toggle_dial_pad = true;
    // },
    backToCallDial() {
      this.pageUrl = "call";
      this.toggle_call_block = true
      this.toggle_dial_pad = false;
    },
    backToCall(){
      this.toggle_call_block = true
      this.toggle_quick_connect = false;
    },
    openCreateTicket(){
      let passData = {};
      passData.action = "openNewTicket";
      parent.postMessage(passData,"*");
      console.log("Open New Ticket contact called");
    },
    backToHome() {
        this.homePageUrl = this.homePageUrl == "countrycode" ? "calllog" : "countrycode";
    },
    createNewContact(){
      this.addContactButton = true;
      this.addContactButtonText = "Saving";
      let name = this.contactForm.contactName

      if(name.length > 4) {

        let passData = {};
        passData.action = "addContact";
        passData.agentId = this.agentUserName;
        passData.contactName = this.contactForm.contactName;
        passData.contactNumber = this.contactForm.contactNumber;

        this.backendCreateContact(passData);

        parent.postMessage(passData,"*");
        console.log("Create new contact triggered");
      } else {
        this.addContactButton = false;
        this.addContactButtonText = "Save Contact";
      }
      
    },
    cancelCreateNewContact(){
      this.homePageUrl = "calllog"
      this.addContactButton = false;
      this.addContactButtonText = "Save Contact";
    },
    checkLogin() {
      let active = localStorage.getItem("activeTabTime")
      console.log("THIS IS ACITVE",active)
      if( moment(active).valueOf() > moment(this.currentActiveTabTime).valueOf()) {
        location.reload();
      }

    },
    handleLogin() {

      
      let activeTab = localStorage.getItem("activeTab")
      console.log("activeTab",activeTab)
      
      let activeTabTime = localStorage.getItem("activeTabTime")

      this.currentActiveTab = activeTab
      console.log("currentActiveTab",this.currentActiveTab)
      this.currentActiveTabTime = activeTabTime
      console.log("currentActiveTabTime",this.currentActiveTabTime)

      if(activeTab == undefined) {
        localStorage.setItem("activeTab", "0");
        localStorage.setItem("activeTabTime", moment().format());
        console.log("THIS IS LOCALSTORAGE",localStorage.setItem("activeTabTime", moment().format()))
      } else if(activeTab == "0") {
        localStorage.setItem("activeTab", "1");
        this.timer = setInterval(this.checkLogin,3000)
        console.log("THIS IS timer",this.timer)
      }

      var thisKey = this;
      var loginUrl = this.connect_url;
      // var loginUrl = "https://sandeza-prod.awsapps.com/connect/ccp#/";

       window.addEventListener('message', function(event) {
        if(event.data.action == "calllogs"){
          if(event.data.callData != null) {
            let eventData = event.data.callData;
            // let eventDataRev = eventData.reverse()
            thisKey.call_history = eventData.slice(0,25);
          }
          thisKey.contacts = event.data.contactList;
          console.log("THIS IS CONTACTSSSS",thisKey.contacts)
          thisKey.languageSelected = event.data.language;
          thisKey.selectedCountry = JSON.parse(event.data.countrySelected);
          thisKey.loggedin = true;
          //thisKey.homePageUrl = 'calllog';
        } else if(event.data.action == "createTicketSuccess"){
          console.log("--> recived created ticket id on connect app <--" + JSON.stringify(event.data.ticket_id));
          thisKey.newCreatedTicket = event.data.ticket_id;
          //if(thisKey.outBoundCall) {
            let ticket = {}
            //{ "id" : "18" , "subject" : "this is subject of the sample aws connect ticket generated by aws connect phone sandeza" }

            ticket.id = event.data.ticket_id;
            ticket.subject = "From " + thisKey.callingNumber

            thisKey.tickets.unshift(ticket)
      
          //}
        } else if(event.data.action == "createNoteSuccess"){
         // console.log("--> recived created note status on connect app <--" + JSON.stringify(event.data.status));
          thisKey.newNoteCreated = event.data.status;
        } else if(event.data.action == "createContactSuccess"){
          //console.log("--> recived created contact status on connect app <--" + JSON.stringify(event.data.status));
          thisKey.newContactCreated = event.data.status;
        } else if(event.data.action == "makeOutboundCall"){
          //console.log("--> recived make outbound call on connect app <--" + JSON.stringify(event.data));
          thisKey.getRequesterInfo(event.data.requesterId)
        } else if(event.data.action == "searchResult"){
          //console.log("--> recived search result on connect app <--" + JSON.stringify(event.data));
          thisKey.contacts = event.data.searchResult;
        } 
      } , false);
      

      if(this.currentActiveTab == "0") {
        this.connectObject = connect.core.initCCP(defaultCCP, {
          ccpUrl: loginUrl,
          loginPopup:    true,
          region: "us-east-1",          
          softphone:     {   
            allowFramedSoftphone : true  
          }
        });
        console.log("THIS IS CORE",this.connectObject)

      }else{
        console.log("ERRORRrrrrr")
      }
      

      // saving agent object to state
      connect.agent(function(agent){
        thisKey.agentObject = agent;
        thisKey.agentStatus = agent.getState().name;
        thisKey.agentStates = agent.getAgentStates();
        console.log("THIS IS AGENTSSSS",agent.getDialableCountries());
        thisKey.dialableCountries = dialableCountries(agent.getDialableCountries());
        //console.log( "===> agent status " + JSON.stringify(agent.getAgentStates()));

        agent.getEndpoints(agent.getAllQueueARNs(), {
          success: function(data){ 
            console.log(data)
            thisKey.quickconnects = data.endpoints;
          },
          failure:function(){
            console.log("getting quick connects failed")
          }
        });

        agent.onStateChange((agentStateChange) => {
            console.log(agentStateChange.newState)
            thisKey.agentStatus = agentStateChange.newState;
        });

      })

      var eventBus = connect.core.getEventBus();
      eventBus.subscribe(connect.AgentEvents.INIT, function () {
        var agentConfig = thisKey.agentObject.getConfiguration();
        thisKey.agentUserName = agentConfig.username;
        // thisKey.getCallLogs()
        // thisKey.getCountryCode()
        // thisKey.getLanguage()
        thisKey.getContacts()
        thisKey.loggedin = true; // remove
        // moving to dataload thisKey.loggedin = true;
        let passData = {};
        passData.action = "agentConnected";
        passData.agentId = agentConfig.username;
        parent.postMessage(passData,"*");
        console.log("Connected Agent -- > "+ thisKey.agentUserName);
      });

      eventBus.subscribe(connect.ContactEvents.REFRESH, function(){
          try {
            //console.log(JSON.stringify(thisKey.contactObject.getSingleActiveThirdPartyConnection()));
            let outbound = thisKey.contactObject.getSingleActiveThirdPartyConnection();
            if(outbound && outbound.isConnecting()){
              console.log("Transfer not COnnected");
                return;
            }
            if(outbound && outbound.isConnected()){
                console.log("Transfer COnnected");
                thisKey.confCall.callerTwoStatus = "Connected";
                this.unsubscribe();
            }
          } catch (e) {
              console.error("Error in addConnection:OnRefresh. " + e.message);
          }
      });
      
      connect.contact(function(contact) {
        var data;
        thisKey.contactObject = contact;


        contact.onIncoming(function(contact) { 
          console.log("==> On Incoming---------------")

          var passData = {};
          // thisKey.agentStatus = "Busy";
          thisKey.noteCreateDisable = false;
        thisKey.createTicketButton = "New Ticket"
            passData.action = "incomingCall";

            console.log("oncall back Connecting---------------"+ JSON.stringify(contact.getAttributes()));
            

            var activeConnection = contact.getActiveInitialConnection();
            var contactId = activeConnection['contactId'];
            thisKey.activeContactId = contactId;
            var connectionId = activeConnection['connectionId'];
            var conn = new connect.Connection(contactId, connectionId);

            var phoneNumber = conn.getEndpoint().phoneNumber;
            if(phoneNumber.startsWith("sip")){
              phoneNumber = phoneNumber.replace(/sip:([^@]*)@.*/, "$1")
            }
            thisKey.callingNumber = phoneNumber;
            passData.contactNumber = phoneNumber;
            data = contact.getAttributes();

            if(data.callFor){
              thisKey.additionalFields = data.callFor.value;
            }
          
                try {
                  var value = JSON.parse(data.customerInfo.value);
                  console.log(value);
                  console.log(value.hasOwnProperty("name"))
                  thisKey.callingName = value.hasOwnProperty("name") ?  value.name : "Unknown Caller";
                  thisKey.callingId = value.id;
                  passData.contactName = value.hasOwnProperty("name") ?  value.name : "Unknown Caller";
                  passData.contactId = value.id;
                  if(value.tickets){
                    console.log("tickets received");
                    thisKey.tickets = value.tickets.openTickets;
                  } else {
                    console.log("no tickets received");
                    passData.tickets = [];
                    thisKey.tickets = [];
                  }
                } catch(e) {
                  console.log("no customer info");
                  thisKey.callingName = "Unknown Caller";
                  thisKey.callingId = "0";
                  passData.contactName = "Unknown Caller";
                  passData.contactId ="0";
                  passData.tickets = [];
                  thisKey.tickets = [];
                }
            

            passData.agentId = thisKey.agentUserName;
            parent.postMessage(passData,"*");
            thisKey.pageUrl= "call";
            thisKey.callStatus = "Incoming";
            thisKey.toggle_call_block = true;

        });
        contact.onConnecting(function(contact) {
          this.callContact = contact;
          var passData = {};
          thisKey.agentStatus = "Busy";
          thisKey.noteCreateDisable = false;
          thisKey.createTicketButton = "New Ticket"
          console.log("==> onConnecting ---------------")

          if(!thisKey.outBoundCall) {
            passData.action = "incomingCall";
            console.log("onConnecting---------------"+ JSON.stringify(contact.getAttributes()));
            

            var activeConnection = contact.getActiveInitialConnection();
            var contactId = activeConnection['contactId'];
            thisKey.activeContactId = contactId;
            var connectionId = activeConnection['connectionId'];
            var conn = new connect.Connection(contactId, connectionId);

            var phoneNumber = conn.getEndpoint().phoneNumber;
            if(phoneNumber.startsWith("sip")){
              phoneNumber = phoneNumber.replace(/sip:([^@]*)@.*/, "$1")
            }
            thisKey.callingNumber = phoneNumber;
            passData.contactNumber = phoneNumber;
            data = contact.getAttributes();

            if(data.callFor){
              thisKey.additionalFields = data.callFor.value;
            }
            
            //if(Object.keys(data).length > 0){
                try {
                  var value = JSON.parse(data.customerInfo.value);
                  console.log(value);
                  console.log(value.hasOwnProperty("name"))
                  thisKey.callingName = value.hasOwnProperty("name") ?  value.name : "Unknown Caller";
                  thisKey.callingId = value.id;
                  passData.contactName = value.hasOwnProperty("name") ?  value.name : "Unknown Caller";
                  passData.contactId = value.id;

                  if(value.tickets){
                    console.log("tickets received");
                    thisKey.tickets = value.tickets.openTickets;
                  } else {
                    console.log("no tickets received");
                    passData.tickets = [];
                    thisKey.tickets = [];
                  }
                } catch(e) {
                  console.log("no customer info");
                  thisKey.callingName = "Unknown Caller";
                  thisKey.callingId = "0";
                  passData.contactName = "Unknown Caller";
                  passData.contactId ="0";
                  passData.tickets = [];
                  thisKey.tickets = [];
                }
            // } else {
            //   console.log("no contact attrt --> else block");
            //   thisKey.callingName = "Unknown Caller";
            //   thisKey.callingId = "0";
            //   passData.contactName = "Unknown Caller";
            //   passData.contactId ="0";
            //   passData.tickets = [];
            //   thisKey.tickets = [];
            // }
            

            passData.agentId = thisKey.agentUserName;
            // thisKey.call_history.unshift(passData);
            //parent.postMessage(passData,"*");
            //console.log("-------------------- pass data " + JSON.stringify(passData));
            thisKey.pageUrl= "call";
            //thisKey.outBoundCall = false;
            thisKey.callStatus = "Incoming";
            thisKey.toggle_call_block = true;
          } else {
            console.log("outbound ---------------"+ JSON.stringify(contact.getAttributes()));
          }
        });
        
        contact.onAccepted(function() {
          thisKey.callStatus = "Connecting";
          console.log("==> On accepted---------------")
         // console.log("on accepted---------------");console.log("INFO Agent "+name+" accepted Call from "+customerNo+ " with case id "+data.key.value);
        });
        
        contact.onConnected(function(contact) {
          thisKey.callStatus = "Connected";
          console.log("==> On Connected---------------")

          // if(thisKey.tickets <= 0 && thisKey.outBoundCall) {
          //   thisKey.createTicketOutbound()
          // }

          if(!thisKey.outBoundCall) {
            var passData = {};
            passData.action = "inboundCall";
            passData.callType = "inbound"
            passData.agentId = thisKey.agentUserName;
            passData.contactId = thisKey.callingId
            passData.contactName = thisKey.callingName;
            passData.contactNumber = thisKey.callingNumber;
            passData.calledTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
            // thisKey.storeCallLogs(passData)
           parent.postMessage(passData,"*");
            //thisKey.call_history.unshift(passData);
            console.log("connected send **> " + JSON.stringify(passData))
          } else {
            console.log("outbound conned ---------------"+ JSON.stringify(contact.getAttributes()));
            data = contact.getAttributes();
            try {
                  var value = JSON.parse(data.customerInfo.value);
                  console.log(value);
                  console.log(value.hasOwnProperty("name"))
                  thisKey.callingName = value.hasOwnProperty("name") ?  value.name : "Unknown Caller";
                  thisKey.activeContactId = contact.getContactId();

                  if(value.tickets){
                    console.log("tickets received");
                    thisKey.tickets = value.tickets.openTickets;
                  } else {
                    console.log("no tickets received");
                    thisKey.tickets = [];
                    thisKey.createTicketOutbound()
                  }
                } catch(e) {
                  console.log("no customer info");
                  thisKey.tickets = [];
                }
          }
        });

        contact.onMissed(function() { 
          console.log("==> On Missed---------------")
          
          var passData = {};
          if(!thisKey.outBoundCall) {
            thisKey.callStatus = "Missed"
            passData.action = "missedcall";
            passData.callType = "Missed"
            passData.agentId = thisKey.agentUserName;
            passData.contactId = thisKey.callingId
            passData.contactName = thisKey.callingName;
            passData.contactNumber = thisKey.callingNumber;
            passData.calledTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
            // thisKey.storeCallLogs(passData)
            parent.postMessage(passData,"*");
            //thisKey.call_history.unshift(passData);
            console.log("missed send **> " + JSON.stringify(passData))
          }
        });
        
        contact.onEnded(function() {
          console.log("==> On Ended---------------")
          thisKey.toggle_quick_connect = false;
          thisKey.toggle_transfer = false;
          if(thisKey.callStatus == 'ACW') {
            thisKey.callStatus = "ACW";
          } else if(thisKey.callStatus == 'Missed') {
            thisKey.callStatus = "Missed";
          } else {
            thisKey.callStatus = "Ended";
          }
          thisKey.dialedNumber = '';
          thisKey.outBoundCall = false;
        });

        contact.onDestroy(function() { 
          console.log("==> On destroyed---------------")
          thisKey.callStatus = "Destroyed";
          // thisKey.agentStatus = "Available"
          var passData = {};
          passData.action = "ENDCALL";
          passData.contactId = thisKey.activeContactId;
          passData.ticketId = thisKey.addNoteFor;
          passData.agentHandled = thisKey.agentUserName;

          thisKey.backendCreateEndcallNote(passData)
          //parent.postMessage(passData,"*");
          thisKey.toggle_call_block = false;
          thisKey.pageUrl = "home";
          thisKey.editor = false
          thisKey.tickets = []
          thisKey.addNoteFor = ""
        });

        contact.onACW(function() { 
          console.log("==> On ACW---------------")
          thisKey.callStatus = "ACW";
        });
        
      });
    },
    cancelEditor(){
      this.editorText = "";
      this.editor = false;
      this.noteCreateDisable = false;
    },
    createTicket(){
      this.noteCreateDisable = true;
      this.createTicketButton = "Creating Ticket";
      let passData = {};
      passData.action = "createTicket";
      passData.callingName = this.callingName
      passData.contactId = this.callingId;
      passData.phoneNumber = this.callingNumber;
      passData.viaType = this.outBoundCall?46:45;
      console.log(passData)

      this.backendCreateTicket(passData);

      //parent.postMessage(passData,"*");
     // console.log("create ticket " + JSON.stringify(passData));
    },
    createTicketOutbound(){
      let passData = {};
      passData.action = "createTicket";
      passData.callingName = "Unknown"
      passData.phoneNumber = this.callingNumber;
      parent.postMessage(passData,"*");

      console.log("-------------> create outbound ticket")
    },
    createNote(ticketId){
      this.addNoteFor = ticketId;
      this.editorHeading = "For #" + ticketId;
      this.edittorButtonName = "Save Note"
      this.editor = true;
    },
    createNoteSubmit(){
      this.noteCreateDisable = true;
      this.edittorButtonName = "Saving Note";
      let passData = {};
      passData.action = "NORMAL";
      passData.ticketId = this.addNoteFor;
      passData.note = this.editorText;

      this.backendCreateNormalNote(passData);

      //parent.postMessage(passData,"*");
     // console.log("create note " + JSON.stringify(passData));
    },
    setAvailable(connect){
      console.log("set available triggered")
      this.setAvailableTrigger = true;
      // let thisKey = this;
      var routableState = this.agentObject.getAgentStates().filter(function(state) {
        return state.type === connect.AgentStateType.ROUTABLE;
      })[0];
      this.agentObject.setState(routableState, {
        success: function() { 
          console.log("set available success");
        },
        failure: function() {
          console.log("set available failed");
        }
      });
    },
    refreshCCP(){
      window.top.location.reload();
    },
    keyDial(number) {
		this.dialedNumber = this.dialedNumber + number
    },
    openContact(contactId){
      var passData = {};
      passData.action = "openContact";
      passData.contactId = contactId;
      passData.type = "no"
      parent.postMessage(passData,"*");

      //console.log("----> passing contact "+ JSON.stringify(passData));
      parent.postMessage(passData,"*");
    },
    openTicket(ticketId){
      var passData = {};
      passData.action = "openTicket";
      passData.type = "no"
      passData.ticketId = ticketId;
      //console.log("----> passing ticket "+ JSON.stringify(passData));
      parent.postMessage(passData,"*");
    },
    onSaveDeskPhone(){

    },
    toggleCountryCodeSettings(){
      this.toggle_country_code_settings = !this.toggle_country_code_settings;
    },
    toggleDialPad() {
      this.homePageUrl = this.homePageUrl == "dialpad" ? "calllog" : "dialpad";
    },
    toggleQuickConnects(){
      this.homePageUrl = this.homePageUrl == "quickconnects" ? "calllog" : "quickconnects";
    },
    toggleCountryCode(){
      this.homePageUrl = this.homePageUrl == "countrycode" ? "calllog" : "countrycode";
    },
    toggleCountryCodeCall(){
      this.callPageUrl = this.callPageUrl == "countrycode" ? "dialpad" : "countrycode";
    },
    backToHomeCall() {

    },
    toggleSettings(){
      this.pageUrl = this.pageUrl == "settings" ? "home" : "settings";
    },
    onAcceptedCall(){
      this.callStatus = "Connecting";
      this.callStartTime = new Date();
      console.log(this.contactObject)
      
        //console.log("-----------------accept Clicked");
        this.contactObject.accept({
          success: function(data) {
            console.log("Successfully answered call.");
            console.log(data);
          },
          failure: function(data) {
            console.log("Failed to answer the call.");
            console.log(data);
          }
        })
    
    },
    onHoldCall(){
      let contact = this.contactObject;
      let thisKey = this;
      this.onHold = !this.onHold;
      if(this.onHold){
        contact.getInitialConnection().hold({
          success: function() { 
            thisKey.callStatus = "On Hold";
            console.log("changed caller one to hold" + contact.getInitialConnection().isOnHold());
          },
          failure: function() { 
            //thisKey.confCall.callerOneStatus = thisKey.confCall.callerOneStatus == "Joined" ? "Joined" : "Connected";
            console.log("changed caller one to hold" + contact.getInitialConnection().isOnHold());
          }
        });
      } else {
        contact.getInitialConnection().resume({
          success: function() { 
            thisKey.callStatus = "Connected";
            console.log("changed caller one to hold");
          },
          failure: function() { 
            console.log("changed caller one to hold");
          }
        });
      }
    },
    onMuteCall(){

      console.log("onmuteclicked " + this.onMute)

      this.onMute = !this.onMute;
      if(this.onMute){
        this.callStatus = "Muted";
        this.agentObject.mute();
      } else {
        this.callStatus = "Connected";
        this.agentObject.unmute();
      }
    },
    onEndCall(){
      console.log("End Button Clicked");
      let thisKey = this;
      this.callStatus = "Ending"
        this.contactObject.getInitialConnection().destroy({
          success: function(data) {
            thisKey.callStatus = "Ended"
            thisKey.callEndTime = new Date();
            this.toggle_call_block = false;
            console.log("Successfully ended call.");
            console.log(data);
          },
          failure: function(data) {
            thisKey.callStatus = "Ended"
            this.toggle_call_block = false;
            console.log("Failed to end the call.");
            console.log(data);
          }
        })
    },
    onDeclineCall(){
      let thisKey = this;
      console.log("Decline Button Clicked")
      this.callStatus = "Ended"
      this.contactObject.getInitialConnection().destroy({
          success: function(data) {
            thisKey.callStatus = "Ended";
            thisKey.callEndTime = new Date();
            this.toggle_call_block = false;
            console.log("Successfully answered call.");
            console.log(data);
          },
          failure: function(data) {
            thisKey.callStatus = "Ended";
            thisKey.callEndTime = new Date();
            this.toggle_call_block = false;
            console.log("Failed to answer the call.");
            console.log(data);
          }
        })
    },
    onDialCall(connect){
      this.toggle_call_block = true;
      this.outBoundCall = true;
      this.callingNumber = "+" + this.selectedCountry.code + this.dialedNumber;
      this.callStatus = "Calling";
      this.pageUrl= "call";
        let thisKey = this;

      var callNumber = connect.Endpoint.byPhoneNumber("+" + this.selectedCountry.code + this.dialedNumber)
      this.agentObject.connect(callNumber, {
        success: function() {
          console.log("Successfully sent outbound call dial");
          var passData = {};
          passData.action = "outboundCall";
          passData.contactId = "0";
          passData.callType = "outbound"
          passData.agentId = thisKey.agentUserName;
          passData.contactName = thisKey.callingName;
          passData.contactNumber = thisKey.callingNumber;
          passData.calledTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
          // thisKey.storeCallLogs(passData)
          parent.postMessage(passData,"*");
          thisKey.call_history.unshift(passData);
          console.log("Dialed send **> " + JSON.stringify(passData))
        },
        failure: function(err) {
          thisKey.callStatus = "Ended";
          thisKey.toggle_call_block = false;
          thisKey.dialedNumber = "";
          thisKey.outBoundCall = false;

          let passData = {}
          passData.action = "outboundFail"
          passData.type = "danger"
          passData.message = "Failed to make outbound call"
          parent.postMessage(passData,"*");

          thisKey.pageUrl= "home";
          console.log("Failed to send outbound call");
          console.log(err);
        }
      });
    },
    onDialCallFromFD(name,number,connect){
      console.log("make FD call ==> " + name + " " + number)
      this.toggle_call_block = true;
      this.outBoundCall = true;
      this.callingName = name;
      this.callingNumber = number;
      this.callStatus = "Calling";
      this.pageUrl= "call";
        let thisKey = this;

      var callNumber = connect.Endpoint.byPhoneNumber(number)
      this.agentObject.connect(callNumber, {
        success: function() {
          console.log("Successfully sent outbound call dial");
          var passData = {};
          passData.action = "outboundCall";
          passData.contactId = "0";
          passData.callType = "outbound"
          passData.agentId = thisKey.agentUserName;
          passData.contactName = thisKey.callingName;
          passData.contactNumber = thisKey.callingNumber;
          passData.calledTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
          // thisKey.storeCallLogs(passData)
          parent.postMessage(passData,"*");
          thisKey.call_history.unshift(passData);
          console.log("Dialed send **> " + JSON.stringify(passData))
        },
        failure: function(err) {
          thisKey.callStatus = "Ended";
          thisKey.toggle_call_block = false;
          thisKey.dialedNumber = "";
          thisKey.outBoundCall = false;
          thisKey.pageUrl= "home";
          
          let passData = {}
          passData.action = "outboundFail"
          passData.type = "danger"
          passData.message = "Failed to make outbound call"
          parent.postMessage(passData,"*");

          console.log("Failed to send outbound call");
          console.log(err);
        }
      });
    },
    changeStatus(agentState){
      console.log("change Status clicked --> " + JSON.stringify(agentState));
      var thisKey = this;

      this.agentObject.setState(agentState, {
        success: function() { 
          console.log("set status " + agentState.name + " success");
          thisKey.agentStatus = agentState.name;
        },
        failure: function() {
          console.log("set available " + agentState.name + " failed");
        }
      });

      // if(agentState == "ROUTABLE") {
      //   var routableState = this.agentObject.getAgentStates().filter(function(state) {
      //     return state.type === connect.AgentStateType.ROUTABLE;
      //   })[0];
      //   console.log("==> state change " + JSON.stringify(routableState));
      //   this.pageUrl = "home";
      //   this.agentObject.setState(routableState, {
      //     success: function() { 
      //       console.log("set available success");
      //       thisKey.agentStatus = "Available"
      //     },
      //     failure: function() {
      //       console.log("set available failed");
      //     }
      //   });
      // } else if(agentState == "OFFLINE") {
      //   var routableState = this.agentObject.getAgentStates().filter(function(state) {
      //     return state.type === connect.AgentStateType.OFFLINE;
      //   })[0];
      //   this.pageUrl = "home";
      //   this.agentObject.setState(routableState, {
      //     success: function() { 
      //       console.log("set offline success");
      //       thisKey.agentStatus = "Offline"
      //       console.log("After change status --> "+ JSON.stringify(thisKey.agentObject.getState()));
      //     },
      //     failure: function() {
      //       console.log("set offline failed");
      //     }
      //   });
      // }
    },
    dialFromHistory(number,name,contactId,connect) {
      this.dialedNumber = number;
      this.callingNumber = number;
      this.callingName = name;
      this.toggle_call_block = true;
      this.callStatus = "Calling";
      this.outBoundCall = true;
      this.pageUrl= "call";

      let thisKey = this;

      var callNumber = connect.Endpoint.byPhoneNumber(number);
      console.log("outbound call " + JSON.stringify(callNumber));
      this.agentObject.connect(callNumber, {
        success: function() {
          console.log("Successfully sent outbound call");
          var passData = {};
          passData.action = "outboundCall";
          passData.contactId = contactId;
          passData.agentId = thisKey.agentUserName;
          passData.contactName = thisKey.callingName;
          passData.contactNumber = thisKey.callingNumber;
          passData.calledTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
          passData.callType = "outbound"
          // thisKey.storeCallLogs(passData)
          parent.postMessage(passData,"*");
          thisKey.call_history.unshift(passData);
          console.log("Dialed history send **> " + JSON.stringify(passData))
        },
        failure: function(err) {
          thisKey.callStatus = "Ended";
          thisKey.toggle_call_block = false;
          thisKey.dialedNumber = "";
          thisKey.outBoundCall = false;

          let passData = {}
          passData.action = "outboundFail"
          passData.type = "danger"
          passData.message = "Failed to make outbound call"
          parent.postMessage(passData,"*");

          thisKey.pageUrl= "home";
          console.log("Failed to send outbound call");
          console.log(err);
        }
      });
  },
  addContact(number) {
    this.contactForm.contactNumber = number;
    this.homePageUrl = "addcontact";
  }
  },
   components: {
      ModelListSelect
  }
}
</script>

<style>
#containerDiv {
		width: 324px; 
		height: 465px; 
		overflow: hidden;
	}

.my-nav-active {
  color: #00425f !important;
  font-weight: bold;
}

.additional-fields {
  font-size: 12px;
  text-align: left;
}

.tabs .nav-link {
  color: #6c757d ;
  padding: 0 !important;
}

.nav-tabs {
  border-bottom: none !important;
}

.nav-tabs .nav-link {
    border: none !important;
}

.pre-signin{
  line-height: 1.5;
  height: 200px;
  margin-top:180px;
  display: inline-block;
  vertical-align: middle;
}

.call-create-ticket{
  float: right;
  height: 25px;
  font-size: 11px;
  margin-top: 6px;
  margin-right: 4px;
}

.call-addnote-ticket {
  float: right;
  height: 20px;
  font-size: 8px;
  margin-right: 5px;
}

.main-logo {
  width: 70px;
  height: 14px;
  margin-top: 16px;
}  
.text-left {
  text-align: left !important;
}
.contact-side-icon {
  margin-right: 5px;
    margin-left: 5px;
}
.call-logs-list {
  height: 328px;
  overflow-x: hidden;
  overflow-y: scroll;
}  

.call-logs-list::-webkit-scrollbar {
  display: none;
}

.call-logs-list {
  -ms-overflow-style: none;
}

.tickets-list {
  height: 255px;
  /* width: 250px; */
  overflow-x: hidden;
  overflow-y: scroll;
}

/* Hide scrollbar for Chrome, Safari and Opera */
.tickets-list::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE and Edge */
.tickets-list {
  -ms-overflow-style: none;
}

.incoming-ticket-heading {
  margin-top: 10px;
  text-align: left;
  font-weight: bold;
}

.call-history-values-right-buttons {
  display: inline-flex;
}

.call-history-values-right-buttons-icons {
  margin: 2px;
}

.call-history-row {
  padding: 5px 0 ;
}

.ticket-history-row {
  padding: 5px 0 ;
}

.call-history-values {
  margin-bottom: 0px !important;
  text-align: left !important;
}

.call-history-values-name {
  font-size: 13px !important;
  cursor: pointer;
}

.call-history-values-name:hover {
  color: #2c5cc5;
}

.call-history-values-number {
  font-size: 12px !important;
}

.call-history-values-date {
   font-size: 8px !important;
}

.settingsIcon{
  cursor: pointer;
}

.call-handle-button-end{
  width: 50%;
  margin: 0 auto;
}

.call-handle-buttons-container{
  margin-top: 10px;
}

.after-call-handle-buttons{
  margin-bottom: 10px !important;
}

.call-control-buttons {
   margin: 0 5px;
}

.call-handle-buttons{
  width: 110px;
  margin: 0 5px;
}

.call-handler {
  display: table;
  width: 100%;
  height: 390px;
  margin: 0 auto;
}
.call-handler-contents {
  display: table-cell;
  margin: 0;
  /* padding: 20px;
  vertical-align: middle; */
}

  .body-container-content {
    margin-top: 15px;
  }

  .button-row {
    margin-top: 10px;
  }

  .dialpad-button {
    width: 23%;
    height: 65px;
    margin-right: 5px;
    margin-left: 5px;
  }

  .dialpad-number {
    font-size: 19px;
    font-weight: bold;
  }

  .dialpad-letters{
    font-size: 13px;
    color: #ccc;
  }

  .title-bar{
    background-color: #001f42;
  }

  .fontIcon {
    color: #e78200;
  }

  .title-status{
    color: #ffffff;
  }

  .body-container{
    padding: 15px 0;
  }

  .dial-pad-button {
    border: 1px solid #ccc;
    border-left: none;
    margin-left: -5px;
    border-radius: 0px;
    color:#ccc;
  }

  .dial-pad-button:hover {
    background: #ffffff;
    border: 1px solid #ccc;
    border-left: none;
    color:#6c757d !important;
  }

  .dial-pad-button:active {
    background: #ffffff !important;
    border: 1px solid #ccc !important;
    color: #00425f !important;
    border-left: none;
    color: #6c757d !important;
  }

  .dial-pad-country-code {
    border: 1px solid #ccc;
    border-right: none;
    margin-right: -5px !important;
    border-radius: 0px;
    color: #495057;
  }

  .dial-pad-country-code:hover {
    background: #ffffff;
    border: 1px solid #ccc;
    border-right: none;
    color: #495057;
  }

  .dial-pad-country-code:focus {
    background: #ffffff !important;
    border: 1px solid #ccc !important;
    border-right: none !important;
    color: #495057;
  }

  .dial-pad-number {
    border-right: none;
    border-left: none
  }

  .dial-pad-number:focus {
    outline: none !important;
    box-shadow: none !important;
    border: 1px solid #ccc !important;
     border-left: none !important;
     border-right: none !important;
  }

  .dialpad-filler {
    visibility: hidden;
  }

  .ccp-container {
    width: 360px; 
		height: 495px;
    border-right: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
    border-left: 1px solid #ccc;
    border-top: 1px solid #ccc;
  }

  .quick-connects-head {
    text-align: left;
  }

  .quick-connects-close-icon {
    float: right;
    font-size: 20px;
    margin-top: 5px;
    cursor: pointer;
  }

  .quick-connects-body {
    margin-top: 10px;
  }

  .quick-connects-name {
    text-align: left !important;
    font-size: 13px;
    margin: 5px;
  }

  .quick-connects-title {
    font-weight: bold;
    font-size: 20px;
  }

  .makeDisable {
    pointer-events: none !important;
    cursor: not-allowed !important;
  }
</style>
