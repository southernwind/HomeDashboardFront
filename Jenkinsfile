node {
  try{
    stage('CheckOut'){
      checkout([$class: 'GitSCM', branches: [[name: '*/master']], doGenerateSubmoduleConfigurations: false, extensions: [[$class: 'SubmoduleOption', disableSubmodules: false, parentCredentials: false, recursiveSubmodules: true, reference: '', trackingSubmodules: false]], submoduleCfg: [], userRemoteConfigs: [[url: 'https://github.com/southernwind/HomeDashboardFront']]])
    }

    stage('npm install') {
      nodejs('node21') {
        sh 'npm -prefix ./ install --force'
      }
    }
    stage('Build'){
      nodejs('node21') {
        sh 'npm -prefix ./ run build -- --c=production'
      }
    }

    withCredentials( \
        bindings: [sshUserPrivateKey( \
          credentialsId: 'ac005f9d-9b4b-496f-873c-1c610df01c03', \
          keyFileVariable: 'SSH_KEY', \
          usernameVariable: 'SSH_USER')]) {
      stage('Deploy'){
          sh 'scp -pr -i ${SSH_KEY} ./dist/Front/* ${SSH_USER}@home-server.localnet:/var/www/html/dashboard'
      }
    }

    stage('Notify Slack'){
      slackSend(
        color: 'good',
        message: "ダッシュボード(Frnt)のデプロイが完了しました。"
      )
    }
  }catch( Exception e ) {
      slackSend(
        color: 'danger',
        message: "ダッシュボード(Front)のデプロイに失敗しました。"
      )
  }
}