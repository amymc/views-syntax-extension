;(global => {
  const checkFile = () => {
    const fileName = document
      .querySelectorAll('.repository-content a')[0]
      .getAttribute('href')

    const re = new RegExp('.view$')
    const isView = re.exec(fileName)

    if (isView) applySyntax()
  }

  // const text = source.replace(/\r\n/g, '\n')
  //  const rlines = text.split('\n')
  //  const lines = rlines.map(line => line.trim())

  const applySyntax = () => {
    console.log('applying syntax')
    const table = document.querySelectorAll(
      '.repository-content .file tbody'
    )[0]
    const rows = Array.from(table.children)
    console.log('table', rows)

    rows.forEach(row => {
      if (/^[A-Z]/.test(row.innerText)) {
        // ^([A-Z][a-zA-Z0-9]*
        const nameSubstring = new RegExp('^[A-Z][a-zA-Z0-9]*').exec(
          row.children[1].innerHTML
        )[0]
        row.children[1].innerHTML = row.children[1].innerHTML.replace(
          nameSubstring,
          `<span style="color:#ff8300;">${nameSubstring}</span>`
        )
        // row.children[1].style.color = '#ff8300'
      } else if (row.innerText.includes('onWhen')) {
        console.log('row.innerText', row.innerText)
        row.children[1].style.color = '#A2E1F9'
        // #A2E1F9
      } else if (row.innerText.includes('when')) {
        row.children[1].style.color = '#00AEEF'
        //#00EFE3
      } else if (row.innerText.includes('<')) {
        // from the first space after the less than
        // all the way to the end of the line

        console.log('row', row.children[1].innerHTML, 'text', row.innerText)
        // use test instead?
        const slotSubstring = new RegExp('&lt;([!a-z][a-zA-Z0-9]*)?').exec(
          row.children[1].innerHTML
        )[0]
        // console.log(
        //   'hey',
        //   new RegExp('&lt;([!a-z][a-zA-Z0-9]*)?').exec(
        //     row.children[1].innerHTML
        //   )
        // )

        row.children[1].innerHTML = row.children[1].innerHTML.replace(
          slotSubstring,
          `<span style="color:#00AEEF;">${slotSubstring}</span>`
        )
        //row.innerText.replace(/</g, '<span style="color:#00EFE3;"><</span>')
        //  slot.style.color = '#00EFE3'
      } else {
        // split on blank spaces
        // item at index 1 should have green colour
        const snippets = row.children[1].innerHTML.split(' ')
        console.log('snippets', snippets[1])

        row.children[1].innerHTML = row.children[1].innerHTML.replace(
          ` ${snippets[1]}`,
          `<span style="color:#1FCC69;"> ${snippets[1]}</span>`
        )
      }
    })
  }

  checkFile()
})()
