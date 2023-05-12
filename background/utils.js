/* global defaults, regtools */
{
  const utils = {};
  self.utils = utils;

  utils.getProfile = (name, callback) => {
    if (name) {
      const pname = 'profile-' + name;
      const ename = 'profile-' + name + '-exceptions';
      chrome.storage.local.get({
        [pname]: '{}',
        [ename]: '[]'
      }, apfs => {
        let profile = JSON.parse(apfs[pname]);
        const exceptions = JSON.parse(apfs[ename]);
        profile = Object.assign({}, defaults.profile, profile);
        exceptions.forEach(name => delete profile[name]);

        callback(profile);
      });
    }
    else {
      chrome.storage.local.get({
        current: 'default'
      }, prefs => utils.getProfile(prefs.current, callback));
    }
  };

  utils.storeProfile = (name, profile, callback = function () { }) => {
    const names = Object.keys(profile);
    const prefs = {
      ['profile-' + name + '-exceptions']: JSON.stringify(
        Object.keys(defaults.profile).filter(name => names.indexOf(name) === -1)
      ),
      ['profile-' + name]: JSON.stringify(
        names.filter(name => profile[name] !== '' && profile[name] !== defaults.profile[name]).reduce((p, c) => {
          p[c] = profile[c];
          return p;
        }, {})
      )
    };
    chrome.storage.local.set(prefs, callback);
  };

  utils.getRules = sRules => {
    const rules = JSON.parse(sRules);
    return Object.assign({}, defaults.rules, rules);
  };

  utils.format = value => {
    const tmp = /^\/(.+)\/[gimuy]*$/.exec(value);
    if (tmp && tmp.length) {
      try {
        value = regtools.gen(tmp[1]);
      }
      catch (e) {
        value = e.message || e;
      }
    }
    value = value.split(/(?:\\n)|(?:<br>)|(?:<br\/>)/).join('\n');
    return value;
  };


  utils.id = e => {
    return e.name || e.id || e.placeholder.replace(/\s/g, '_');
  };
  utils.inputs = (target, inputs, types) => {
    for (const e of target.querySelectorAll('[name]')) {
      if (types.test(e.type)) {
        inputs.add(e);
      }
    }
    for (const e of target.querySelectorAll('input, textarea')) {
      if (utils.id(e) && types.test(e.type)) {
        inputs.add(e);
      }
    }
  };

}
